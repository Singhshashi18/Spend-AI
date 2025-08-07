import { sendEmail } from "@/action/send-email";
import { db } from "../prisma";
import { inngest } from "./client";
import EmailTemplate from "@/emails/templates";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const checkBudgetAlert=inngest.createFunction(
    {name:'check budget alerts'},
    {cron:'0 */6 * * *'},
    async ({step})=>{
        const budgets=await step.run('fetch-budget',async ()=>{
            return await db.budget.findMany({
                include:{
                    user:{
                        include:{
                            accounts:{
                                where:{
                                    isDefault:true,
                                },
                            },
                        },
                    },
                },
            });
        });

        for(const budget of budgets){
            const defaultAccount=budget.user.accounts[0];
            if(!defaultAccount) continue;

            await step.run(`check-budget-${budget.id}`,async()=>{

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

                const expenses=await db.transaction.aggregate({
                    where:{
                        userId:budget.userId,
                        accountId:defaultAccount.id,
                        type:"EXPENSE",
                        date:{
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                    _sum:{
                        amount:true,
                    },
                });

                const totalExpenses=expenses._sum.amount?.toNumber() || 0;
                console.log('te:',totalExpenses)

                const budgetAmount=budget.amount;
                const percentageUsed=(totalExpenses / budgetAmount)*100;
                console.log('budget:',percentageUsed)

                if(percentageUsed >=80 && 
                    (!budget.lastAlertSent ||
                        isNewMonth(new Date(budget.lastAlertSent),new Date())
                    ))
                    {
                       await sendEmail({
                        to:budget.user.email,
                        subject:`Budget alert for ${defaultAccount.name}`,
                        react:EmailTemplate({
                            userName:budget.user.name,
                            type:'budget-alert',
                            data:{
                                percentageUsed,
                                budgetAmount:parseInt(budgetAmount).toFixed(1),
                                totalExpenses:parseInt(totalExpenses).toFixed(1),
                                accountName:defaultAccount.name,
                            },
                        }),
                       });

                       await db.budget.update({
                        where:{id:budget.id},
                        data:{lastAlertSent:new Date()},
                       });
                    }
                
            });
        }
    }
);

function isNewMonth(lastAlertDate,currentDate){
    return(
        lastAlertDate.getMonth()!==currentDate.getMonth()||
        lastAlertDate.getFullYear()!==currentDate.getFullYear()
    );
}


async function generateFinancialInsights(stats, month) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: $${stats.totalIncome}
    - Total Expenses: $${stats.totalExpenses}
    - Net Income: $${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) =>` ${category}: $${amount}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
}

export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
  },
  { cron: "0 0 1 * *" }, // First day of each month
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        include: { accounts: true },
      });
    });

    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user.id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        });

        // Generate AI insights
        const insights = await generateFinancialInsights(stats, monthName);

        await sendEmail({
          to: user.email,
          subject:`Your Monthly Financial Report - ${monthName}`,
          react: EmailTemplate({
            userName: user.name,
            type: "monthly-report",
            data: {
              stats,
              month: monthName,
              insights,
            },
          }),
        });
      });
    }

    return { processed: users.length };
  }
);

async function getMonthlyStats(userId, month) {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
}
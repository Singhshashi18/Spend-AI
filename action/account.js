'use server'
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { object } from "zod";


const serializedTransaction=(obj)=>{
    const serialized={...obj};
    if(obj.balance){
   serialized.balance=obj.balance.toNumber();
    }
    if(obj.amount){
   serialized.amount=obj.amount.toNumber();
    }
    return serialized;
}

export async function getAccountWithTransactions(accountId){
    const {userId}=await auth();
    if(!userId) throw new Error('unauthorized')

        const user=await db.user.findUnique({
            where:{clerkUserId:userId},
        });

        if(!user){
            throw new Error('user not found')
        }
        const account=await db.account.findUnique({
            where:{id:accountId,userId:user.id},
            include:{
                        transactions:{
                orderBy:{date:'desc'},
            },
            _count:{
            select:{transactions:true},
            }
            }
           
        });
        if(!account){
            return null;
        }
        return{
            ...serializedTransaction(account),
            transactions:account.transactions.map(serializedTransaction),
        }
}

export async function bulkDeleteTransactions(transactionIds){
   try {
    const {userId}=await auth();
    if(!userId) throw new Error('unauthorized')

        const user=await db.user.findUnique({
            where:{clerkUserId:userId},
        });

        if(!user){
            throw new Error('user not found')
        }

        const transactions=await db.transaction.findMany({
            where:{
                id:{in:transactionIds},
                userId:user.id,
            },
        });

        const accountBalanceChanges=transactions.reduce((acc,transaction)=>{
            const changes=transaction.type === 'EXPENSE'
            ? transaction.amount
            : -transaction.amount;

            acc=[transaction.accountId]=(acc[transaction.accountId] || 0)+ changes;
            return acc;
        },{});

        //deleting account and updating balance in the transaction

        await  db.$transaction(async(tx)=>{

            await tx.transaction.deleteMany({
                where:{
                    id:{in:transac},
                    userId:user.id,
                },
            })

            for(const[accountId,balanceChange] of object.entries(
                accountBalanceChanges
            )) {
                await tx.transaction.update({
                where:{
                    id:accountId
                },
                data:{
                    balance:{
                        increamet:balanceChange,
                    },
                },
            })
            }
        });

        revalidatePath('/dashboard');
        revalidatePath('/account/[id]');
        return {success:true};
            
   } catch (error) {
    return {success:false,error:error.message};
   }
}
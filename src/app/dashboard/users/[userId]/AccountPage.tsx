"use client";

import React, { useEffect, useState } from "react";
import PaymentCard, {
  PaymentCardSkeleton,
} from "@/components/page/user-page/PaymentCard";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore } from "@/firebase";
import PassportCard, {
  PassportCardSkeleton,
} from "@/components/page/user-page/PassportCard";

interface IAccountPage {
  userId: string;
  user: UserType;
}

const AccountPage: React.FC<IAccountPage> = ({ userId }) => {
  const [paymentCards, setPaymentCards] = useState<PaymentCardType[] | null>(
    null
  );
  const [passports, setPassports] = useState<PassportCardType[] | null>(null);

  useEffect(() => {
    const paymentCardsUnsub = onSnapshot(
      query(
        collection(firestore, "users", userId, "paymentCards"),
        orderBy("createdAt", "desc")
      ),
      (_data) => {
        const _paymentCards: PaymentCardType[] = [];
        _data.docs.map((_doc) => {
          _paymentCards.push(_doc.data() as PaymentCardType);
        });

        setPaymentCards(_paymentCards);
      }
    );

    const passportUnsub = onSnapshot(
      query(
        collection(firestore, "users", userId, "passports"),
        orderBy("createdAt", "desc")
      ),
      (_data) => {
        const _passports: PassportCardType[] = [];
        _data.docs.map((_doc) => {
          _passports.push(_doc.data() as PassportCardType);
        });

        setPassports(_passports);
      }
    );
  }, []);

  return (
    <div>
      <h1 className="text-lg font-medium text-zinc-500">Payment Methods</h1>
      <hr />
      <div className="flex flex-wrap gap-8 mt-5">
        {paymentCards != null ? (
          paymentCards.length == 0 ? (
            <div className="text-sm text-zinc-300">
              No payment card information
            </div>
          ) : (
            paymentCards.map((_paymentCard, index) => (
              <PaymentCard paymentCard={_paymentCard} key={index} />
            ))
          )
        ) : (
          <>
            <PaymentCardSkeleton opacity={0} />
            <PaymentCardSkeleton opacity={1} />
            <PaymentCardSkeleton opacity={2} />
          </>
        )}
      </div>

      <h1 className="mt-8 text-lg font-medium text-zinc-500">Passports</h1>
      <hr />
      <div className="flex flex-wrap gap-8 mt-5">
        {passports != null ? (
          passports.length == 0 ? (
            <div className="text-sm text-zinc-300">No passport information</div>
          ) : (
            passports.map((_passport, index) => (
              <PassportCard passport={_passport} key={index} />
            ))
          )
        ) : (
          <>
            <PassportCardSkeleton opacity={0} />
            <PassportCardSkeleton opacity={1} />
            <PassportCardSkeleton opacity={2} />
          </>
        )}
      </div>
    </div>
  );
};

export default AccountPage;

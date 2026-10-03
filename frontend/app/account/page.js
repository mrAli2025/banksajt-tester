"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const FEATURE_NEW_DASHBOARD = process.env.NEXT_PUBLIC_FEATURE_NEW_DASHBOARD === "true";

export default function Account() {
  const [amount, setAmount] = useState(null);
  const [deposit, setDeposit] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_URL}/me/accounts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("Kunde inte hämta saldo");
        }

        const data = await response.json();
        setAmount(data.amount);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBalance();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/me/accounts/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, amount: Number(deposit) }),
      });

      if (!response.ok) {
        throw new Error("Kunde inte sätta in pengar");
      }

      const data = await response.json();
      setAmount(data.amount);
      setDeposit("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4">
      <div className="flex flex-col gap-6 w-full max-w-sm bg-white dark:bg-zinc-900 p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-center">Mitt konto</h1>

        {FEATURE_NEW_DASHBOARD && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
            🎉 Nytt: Spara pengar automatiskt med vårt sparkonto!
          </div>
        )}

        <p className="text-center text-xl">
          Saldo: {amount !== null ? `${amount} kr` : "Laddar..."}
        </p>

        <form onSubmit={handleDeposit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="deposit">Belopp</label>
            <input
              id="deposit"
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              className="border rounded px-3 py-2"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="rounded-full bg-foreground px-6 py-3 text-background font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Sätt in pengar
          </button>
        </form>

        <Link
          href="/transactions"
          className="text-center text-sm font-medium underline underline-offset-4"
        >
          Visa transaktionshistorik
        </Link>
      </div>
    </div>
  );
}
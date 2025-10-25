"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAccount, useBalance, usePublicClient } from "wagmi";
import { blockdag } from "@/lib/chains";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

interface SimpleBlock {
  number: bigint;
  hash: `0x${string}` | null;
  timestamp: bigint;
}

export default function BlockDagPage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: blockdag.id });
  const { data: bal } = useBalance({ address, chainId: blockdag.id, enabled: Boolean(address) });
  const [blocks, setBlocks] = useState<SimpleBlock[]>([]);
  const [txCount, setTxCount] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!publicClient) return;
        const latest = await publicClient.getBlockNumber();
        const toFetch = [latest, latest - 1n, latest - 2n].filter(n => n > 0n);
        const fetched = await Promise.all(
          toFetch.map(async (n) => {
            const b = await publicClient.getBlock({ blockNumber: n });
            return { number: b.number ?? n, hash: b.hash ?? null, timestamp: b.timestamp ?? 0n } as SimpleBlock;
          })
        );
        setBlocks(fetched);
        if (address) {
          const c = await publicClient.getTransactionCount({ address });
          setTxCount(c);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to fetch BlockDag data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [publicClient, address]);

  const formattedBalance = useMemo(() => {
    return bal ? `${Number(bal.value) / 1e18} ${bal.symbol}` : "-";
  }, [bal]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">BlockDag</h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#194dbe] relative text-white p-6 py-[3rem]">
            <Image
              src={'/doodle.png'}
              fill
              alt="doodle"
              draggable={false}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="z-0 absolute opacity-5 object-cover"
            />
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg z-10 font-medium">Wallet Overview</h2>
            </div>
            <div className="z-10 text-sm opacity-90 mb-2">Chain: {blockdag.name} (ID {blockdag.id})</div>
            <div className="flex z-10 items-baseline flex-col">
              <div className="flex items-baseline">
                <span className="text-3xl z-10 font-bold">{isConnected ? formattedBalance : 'Connect to view'}</span>
                <span className="ml-2 z-10 text-sm opacity-80">{bal?.symbol ?? 'BDAG'}</span>
              </div>
              <div className="flex items-baseline mt-2">
                <span className="text-xl z-10 font-medium font-mono">{address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'No wallet connected'}</span>
                <span className="ml-2 z-10 text-xs opacity-80">Address</span>
              </div>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Transactions</div>
              <div className="text-2xl font-bold text-gray-900">{txCount !== null ? Number(txCount) : '-'}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
              <div className="text-sm text-gray-600 mb-2">Recent Blocks</div>
              {loading && <div className="text-gray-500">Loading...</div>}
              {error && <div className="text-red-600">{error}</div>}
              {!loading && !error && (
                <div className="space-y-2">
                  {blocks.map((b) => (
                    <div key={`${b.number}`} className="flex items-center justify-between p-3 rounded-md bg-white border">
                      <div className="font-mono text-gray-800">#{b.number.toString()}</div>
                      <div className="font-mono text-gray-600 truncate max-w-[40%]">{b.hash ?? 'N/A'}</div>
                      <div className="text-gray-500 text-sm">{new Date(Number(b.timestamp) * 1000).toLocaleString()}</div>
                    </div>
                  ))}
                  {blocks.length === 0 && <div className="text-gray-500">No block data available.</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
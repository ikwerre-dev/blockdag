import { prisma } from "@/lib/db";
import Image from "next/image";

export default async function PublicProfile({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      card: true,
      records: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="text-gray-600 mt-2">The medical card link is invalid.</p>
        </div>
      </div>
    );
  }

  const color = user.card?.color || "#194dbe";
  const text = user.card?.text || "";
  const visible = (user.card?.visibleFields as any) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
            <Image src="/images/doodle.png" width={220} height={220} alt="doodle" />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full" style={{ backgroundColor: color }}></div>
              <div>
                <div className="text-2xl font-bold">
                  {visible.name !== false ? `${user.firstName ?? ''} ${user.lastName ?? ''}` : 'Hidden Name'}
                </div>
                <div className="text-sm text-gray-600">@{user.handle}</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-700">
              {text}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Medical Details</h2>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              {visible.bloodType !== false && (
                <div>Blood Type: {user.bloodType || 'N/A'}</div>
              )}
              {visible.phone !== false && (
                <div>Phone: {user.phone || 'N/A'}</div>
              )}
              {visible.email !== false && (
                <div>Email: {user.email || 'N/A'}</div>
              )}
              {visible.address !== false && (
                <div>Location: {[user.city, user.region, user.country].filter(Boolean).join(', ') || 'N/A'}</div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Recent Records</h2>
            <div className="mt-4 space-y-3">
              {user.records.length === 0 && <div className="text-sm text-gray-600">No records yet.</div>}
              {user.records.map((r) => (
                <div key={r.id} className="border rounded-lg p-3">
                  <div className="font-medium">{r.title}</div>
                  {r.description && <div className="text-sm text-gray-600 mt-1">{r.description}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
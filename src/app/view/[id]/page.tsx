import { prisma } from "@/lib/db";
import Image from "next/image";
import IncrementCardView from "@/components/IncrementCardView";

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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://VelTrust.com";
  const profileUrl = `${baseUrl}/view/${user.id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <IncrementCardView userId={user.id} />
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Card header styled like dashboard with blue bg and doodle */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-center p-6">
            <div className="relative" style={{ width: 340, height: 214 }}>
              <div className="absolute inset-0 rounded-xl" style={{ backgroundColor: color }}></div>
              <Image
                src={'/doodle.png'}
                fill
                alt="doodle"
                draggable={false}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="z-0 absolute opacity-5 object-cover rounded-xl"
              />
              {/* Top-right transparent logo */}
              <Image src="/logo-transparent.png" alt="logo" width={60} height={20} className="absolute top-3 right-3 z-10 opacity-90" />

              <div className="absolute inset-0 p-4 text-white z-10 flex flex-col justify-between">
                <div>
                  <div className="text-xl font-bold">{visible.name !== false ? `${user.firstName ?? ''} ${user.lastName ?? ''}` : 'Hidden Name'}</div>
                  <div className="text-xs opacity-80">@{user.handle}</div>
                  {visible.email !== false && <div className="text-xs mt-2 opacity-90">{user.email || ''}</div>}
                  <div className="text-xs mt-2">{text}</div>
                </div>
                <div className="flex items-center justify-between text-xs opacity-90">
                  <span>Encrypted</span>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(profileUrl)}`}
                    alt="Profile QR"
                    className="rounded"
                    style={{ width: 48, height: 48 }}
                  />
                </div>
              </div>
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
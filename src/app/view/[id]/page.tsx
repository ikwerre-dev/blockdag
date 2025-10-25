import { prisma } from "@/lib/db";
import IncrementCardView from "@/components/IncrementCardView";
import EmergencyMode from "@/components/EmergencyMode";
import PublicRecordItem from "@/components/PublicRecordItem";

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
  const initials = (((user.firstName ?? '').charAt(0)) + ((user.lastName ?? '').charAt(0))).toUpperCase() || 'V';

  return (
    <div className="min-h-screen bg-slate-50">
      <IncrementCardView userId={user.id} />

      {/* Hero header with blue background and doodle overlay */}
      <div className="relative isolate">
        <div className="bg-[#194dbe] text-white">
          <div className="max-w-5xl mx-auto px-4 py-10 md:py-12">
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-lg">
              <img
                src={'/doodle.png'}
                alt="doodle"
                draggable={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="absolute inset-0 z-0 opacity-15 object-cover"
              />

              <div className="relative z-10 p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-semibold">
                      {initials}
                    </div>
                    <div>
                      <div className="text-lg md:text-xl font-semibold">
                        {visible.name !== false ? `${user.firstName ?? ''} ${user.lastName ?? ''}` : 'Hidden Name'}
                      </div>
                      <div className="text-xs opacity-80">@{user.handle}</div>
                    </div>
                  </div>

                  <img src="/logo-transparent.png" alt="logo" width={80} height={26} className="opacity-90" />
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr,auto] gap-6 items-center">
                  <div className="text-sm opacity-90">
                    {visible.email !== false && <div className="">{user.email || ''}</div>}
                    <div className="mt-1">{text}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(profileUrl)}`}
                      alt="Profile QR"
                      className="rounded-lg shadow-sm"
                      style={{ width: 72, height: 72 }}
                    />
                    <div className="text-xs opacity-90">Encrypted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content cards */}
        <div className="max-w-5xl mx-auto px-4 -mt-6 md:-mt-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Medical Details</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {visible.bloodType !== false && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Blood Type</span>
                    <span className="font-medium">{user.bloodType || 'N/A'}</span>
                  </div>
                )}
                {visible.phone !== false && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-medium">{user.phone || 'N/A'}</span>
                  </div>
                )}
                {visible.email !== false && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium">{user.email || 'N/A'}</span>
                  </div>
                )}
                {visible.address !== false && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Location</span>
                    <span className="font-medium">{[user.city, user.region, user.country].filter(Boolean).join(', ') || 'N/A'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Recent Records</h2>
              <div className="mt-4 space-y-3">
                {user.records.length === 0 && (
                  <div className="text-sm text-slate-600">No records yet.</div>
                )}
                {user.records.map((r) => (
                  <PublicRecordItem key={r.id} record={r} />
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Mode toggle and panel */}
          <div className="mt-8">
            <EmergencyMode />
          </div>
        </div>
      </div>
    </div>
  );
}
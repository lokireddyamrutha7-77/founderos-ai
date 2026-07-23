import {
  BarChart3,
  TrendingUp,
  Wallet,
  CalendarDays,
  Users,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="w-full max-w-[390px]">

      <div className="bg-white rounded-[28px] shadow-xl p-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">

          <div>
            <p className="text-gray-500 text-sm">
              Founder Dashboard
            </p>

            <h2 className="text-[20px] font-bold text-[#1A1A1A]">
              Business Overview
            </h2>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#FAF5EB] flex items-center justify-center">
            <BarChart3
              size={22}
              className="text-[#C9A961]"
            />
          </div>

        </div>

        {/* Revenue Card */}

        <div className="bg-[#FAF7F0] rounded-[22px] p-5 mb-3">

          <div className="flex justify-between items-center mb-4">

            <span className="text-gray-500 text-base">
              Revenue
            </span>

            <span className="text-[18px] font-bold">
              ₹2.4L
            </span>

          </div>

          <div className="flex justify-center items-end gap-3 h-28">

            <div className="w-4 h-16 bg-[#C9A961] rounded-full"></div>

            <div className="w-4 h-24 bg-[#C9A961] rounded-full"></div>

            <div className="w-4 h-20 bg-[#C9A961] rounded-full"></div>

            <div className="w-4 h-28 bg-[#C9A961] rounded-full"></div>

            <div className="w-4 h-20 bg-[#C9A961] rounded-full"></div>

            <div className="w-4 h-24 bg-[#C9A961] rounded-full"></div>

          </div>

        </div>

        {/* Bottom Cards */}

        <div className="grid grid-cols-2 gap-3">

          <div className="bg-[#FAF7F0] rounded-2xl p-3">

            <TrendingUp
              className="text-[#C9A961] mb-2"
              size={20}
            />

            <p className="text-sm text-gray-500">
              Growth
            </p>

            <h3 className="text-2xl font-bold">
              +28%
            </h3>

          </div>

          <div className="bg-[#FAF7F0] rounded-2xl p-3">

            <Wallet
              className="text-[#C9A961] mb-2"
              size={20}
            />

            <p className="text-sm text-gray-500">
              Finance
            </p>

            <h3 className="text-2xl font-bold">
              Healthy
            </h3>

          </div>

          <div className="bg-[#FAF7F0] rounded-2xl p-3">

            <Users
              className="text-[#C9A961] mb-2"
              size={20}
            />

            <p className="text-sm text-gray-500">
              Customers
            </p>

            <h3 className="text-2xl font-bold">
              4,520
            </h3>

          </div>

          <div className="bg-[#FAF7F0] rounded-2xl p-3">

            <CalendarDays
              className="text-[#C9A961] mb-2"
              size={20}
            />

            <p className="text-sm text-gray-500">
              Tasks
            </p>

            <h3 className="text-2xl font-bold">
              18
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
}
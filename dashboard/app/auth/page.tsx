"use client";

import { subtitle, title } from "@/components/primitives";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  UsersIcon,
  BookIcon,
  CalendarIcon,
  ActivityIcon,
} from "@/components/icons";

export default function Home() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className={title()}>Dashboard</h1>
        <p className={subtitle({ class: "mt-1" })}>
          Welcome back! Here&apos;s what&apos;s happening in your school today.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          className="bg-primary/5"
          icon={<UsersIcon size={24} />}
          title="Total Students"
          trend={{ value: 12, isPositive: true }}
          value="2,543"
        />
        <StatCard
          className="bg-secondary/5"
          icon={<BookIcon size={24} />}
          title="Total Teachers"
          trend={{ value: 2, isPositive: true }}
          value="128"
        />
        <StatCard
          className="bg-warning/5"
          icon={<CalendarIcon size={24} />}
          title="Attendance Rate"
          trend={{ value: 0.8, isPositive: false }}
          value="94.2%"
        />
        <StatCard
          className="bg-success/5"
          icon={<ActivityIcon size={24} />}
          title="Revenue"
          trend={{ value: 8, isPositive: true }}
          value="$124,500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Placeholder for a Chart */}
          <div className="w-full h-[400px] bg-content1 rounded-large shadow-sm p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-large">Enrollment Trends</h3>
              <div className="flex gap-2 text-small text-default-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary" /> This Year
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-default-200" /> Last
                  Year
                </span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-default-400 bg-default-50/50 rounded-medium border border-dashed border-default-200">
              Chart Component Placeholder
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickActions />
            {/* Another widget placeholder */}
            <div className="h-full bg-content1 rounded-large shadow-sm p-6">
              <h3 className="font-semibold text-large mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-12 h-12 rounded-medium bg-primary/10 flex flex-col items-center justify-center text-primary shrink-0">
                      <span className="text-tiny font-bold">NOV</span>
                      <span className="text-large font-bold">{20 + i}</span>
                    </div>
                    <div>
                      <p className="font-medium">Parent Teacher Meeting</p>
                      <p className="text-small text-default-500">
                        10:00 AM - 12:00 PM
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="flex flex-col gap-6">
          <RecentActivity />

          {/* System Status / Info */}
          <div className="bg-content1 rounded-large shadow-sm p-6">
            <h3 className="font-semibold text-large mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-default-500">Server Status</span>
                <span className="text-success font-medium flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-default-500">Last Backup</span>
                <span className="text-default-900">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-default-500">Version</span>
                <span className="text-default-900">v2.4.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

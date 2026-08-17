import React, { Suspense } from 'react';
import {
  ClipboardList,
  DollarSign,
  TrendingUp,
  ChefHat,
} from 'lucide-react';
import { getHotelAnalytics } from '@/actions/analytics';
import { getRecentOrders } from '@/actions/admin';
import { AnalyticsHeader } from '@/components/admin/AnalyticsHeader';
import { StatsCard } from '@/components/admin/StatsCard';
import { RevenueTrendChart } from '@/components/admin/RevenueTrendChart';
import { PopularItemsList } from '@/components/admin/PopularItemsList';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { formatCurrency } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const revalidate = 0; // Live admin analytics on request

interface AdminDashboardPageProps {
  searchParams: Promise<{ period?: 'today' | 'yesterday' | '7days' | '30days' }>;
}

async function DashboardContent({ searchParams }: AdminDashboardPageProps) {
  const resolvedParams = await searchParams;
  const period = resolvedParams.period || 'today';

  // Fetch real database analytics & recent orders in parallel
  const [analytics, recentOrders] = await Promise.all([
    getHotelAnalytics(period),
    getRecentOrders(10),
  ]);

  const periodLabels = {
    today: "Today's",
    yesterday: "Yesterday's",
    '7days': 'Last 7 Days',
    '30days': 'Last 30 Days',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Analytics Date Selector Header */}
      <AnalyticsHeader currentPeriod={period} />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={`${periodLabels[period]} Orders`}
          value={analytics.totalOrders}
          subtitle={`Total orders in period`}
          icon={<ClipboardList className="h-5 w-5 text-stone-700 dark:text-stone-300" />}
          variant="default"
        />

        <StatsCard
          title={`${periodLabels[period]} Revenue`}
          value={formatCurrency(analytics.totalRevenue)}
          subtitle="Non-cancelled total"
          icon={<DollarSign className="h-5 w-5 text-blue-500" />}
          variant="revenue"
        />

        <StatsCard
          title="Average Order Value"
          value={formatCurrency(analytics.averageOrderValue)}
          subtitle="Revenue per non-cancelled order"
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          variant="ready"
        />

        <StatsCard
          title="Active Kitchen Queue"
          value={
            analytics.statusCounts.PENDING +
            analytics.statusCounts.PREPARING
          }
          subtitle={`${analytics.statusCounts.PENDING} pending • ${analytics.statusCounts.PREPARING} cooking`}
          icon={<ChefHat className="h-5 w-5 text-amber-500" />}
          variant="pending"
        />
      </div>

      {/* Charts & Popular Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueTrendChart data={analytics.dailyTrends} />
        <PopularItemsList items={analytics.popularItems} />
      </div>

      {/* Live Recent Orders Feed */}
      <RecentOrders orders={recentOrders} />
    </div>
  );
}

export default function AdminDashboardPage(props: AdminDashboardPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner label="Calculating hotel metrics..." />}>
      <DashboardContent {...props} />
    </Suspense>
  );
}

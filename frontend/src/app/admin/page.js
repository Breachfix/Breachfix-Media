import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Eye, Video, DollarSign, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-black">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Video className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Manage Content</h2>
                <p className="text-sm text-muted-foreground">Upload, edit, and organize media</p>
                <Link href="/admin/content" className="text-blue-600 hover:underline">Go to Content</Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Eye className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Insights</h2>
                <p className="text-sm text-muted-foreground">Track views, trends, and audience</p>
                <Link href="/admin/insights" className="text-blue-600 hover:underline">Go to Insights</Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <DollarSign className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Earnings</h2>
                <p className="text-sm text-muted-foreground">View revenue & payouts</p>
                <Link href="/admin/earnings" className="text-blue-600 hover:underline">Go to Earnings</Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <BarChart className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Submissions</h2>
                <p className="text-sm text-muted-foreground">Moderate content submissions</p>
                <Link href="/admin/submissions" className="text-blue-600 hover:underline">View Submissions</Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Settings className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Settings</h2>
                <p className="text-sm text-muted-foreground">Configure platform behavior</p>
                <Link href="/admin/settings" className="text-blue-600 hover:underline">Manage Settings</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

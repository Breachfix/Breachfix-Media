// src/app/admin/content/page.js

import { Card, CardContent } from "@/components/ui/card";

export default function ContentDashboard() {
  return (
    <Card>
      <CardContent className="p-4">
        <h1 className="text-2xl font-semibold mb-2">Admin Content Dashboard</h1>
        <p className="text-sm text-gray-500">
          Select a section from the left to manage content like movies, TV shows, and episodes.
        </p>
      </CardContent>
    </Card>
  );
}
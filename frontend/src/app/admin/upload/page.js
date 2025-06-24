"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Film, Tv, Layers, Users, Building2 } from "lucide-react";

const UploadOptions = [
  {
    label: "Upload Movie",
    icon: <Film className="w-6 h-6" />,
    href: "/admin/upload/movies",
  },
  {
    label: "Upload TV Show",
    icon: <Tv className="w-6 h-6" />,
    href: "/admin/upload/tvshows",
  },
  {
    label: "Upload Episode",
    icon: <Layers className="w-6 h-6" />,
    href: "/admin/upload/episodes",
  },
  {
    label: "Upload Actor",
    icon: <Users className="w-6 h-6" />,
    href: "/admin/upload/actors",
  },
  {
    label: "Upload Company",
    icon: <Building2 className="w-6 h-6" />,
    href: "/admin/upload/companies",
  },
];

export default function UploadEntryPage() {
  return (
    <div className="p-6 space-y-6">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <UploadCloud className="w-7 h-7 text-blue-600" />
            Upload New Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {UploadOptions.map((option) => (
              <Link href={option.href} key={option.label}>
                <Button
                  variant="outline"
                  className="w-full h-28 flex flex-col items-center justify-center gap-2 text-base"
                >
                  {option.icon}
                  {option.label}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
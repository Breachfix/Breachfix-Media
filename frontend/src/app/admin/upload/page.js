"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Film, Tv, Layers, Users, Building2 } from "lucide-react";

const UploadOptions = [
  {
    label: "Upload Movie",
    icon: <Film className="w-6 h-6 md:w-7 md:h-7" />,
    href: "/admin/upload/movies",
  },
  {
    label: "Upload TV Show",
    icon: <Tv className="w-6 h-6 md:w-7 md:h-7" />,
    href: "/admin/upload/tvshows",
  },
  {
    label: "Upload Episode",
    icon: <Layers className="w-6 h-6 md:w-7 md:h-7" />,
    href: "/admin/upload/episodes",
  },
  {
    label: "Upload Actor",
    icon: <Users className="w-6 h-6 md:w-7 md:h-7" />,
    href: "/admin/upload/actors",
  },
  {
    label: "Upload Company",
    icon: <Building2 className="w-6 h-6 md:w-7 md:h-7" />,
    href: "/admin/upload/companies",
  },
];

export default function UploadEntryPage() {
  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-6">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2">
            <UploadCloud className="w-7 h-7 text-blue-600" />
            <span>Upload New Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {UploadOptions.map((option) => (
              <Link href={option.href} key={option.label}>
                <Button
                  variant="outline"
                  className="w-full h-24 sm:h-28 lg:h-32 flex flex-col items-center justify-center gap-2 text-sm sm:text-base md:text-lg"
                >
                  {option.icon}
                  <span>{option.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
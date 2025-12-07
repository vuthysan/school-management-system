import React from "react";
import { Users, BookOpen, Calendar, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const QuickActions = () => {
  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-0 pt-4 px-4">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription className="text-xs uppercase font-bold">
          Manage your school
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4 grid grid-cols-2 gap-3">
        <Button
          className="h-24 flex flex-col gap-2 bg-primary/10 text-primary hover:bg-primary/20"
          variant="secondary"
        >
          <Users className="h-6 w-6" />
          <span className="font-medium">Add Student</span>
        </Button>
        <Button
          className="h-24 flex flex-col gap-2 bg-secondary/80 hover:bg-secondary"
          variant="secondary"
        >
          <BookOpen className="h-6 w-6" />
          <span className="font-medium">Create Course</span>
        </Button>
        <Button
          className="h-24 flex flex-col gap-2 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
          variant="secondary"
        >
          <Calendar className="h-6 w-6" />
          <span className="font-medium">Schedule Event</span>
        </Button>
        <Button
          className="h-24 flex flex-col gap-2 bg-green-500/10 text-green-600 hover:bg-green-500/20"
          variant="secondary"
        >
          <Activity className="h-6 w-6" />
          <span className="font-medium">Generate Report</span>
        </Button>
      </CardContent>
    </Card>
  );
};

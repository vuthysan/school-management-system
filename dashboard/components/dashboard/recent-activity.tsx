import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";

const activities = [
  {
    id: 1,
    user: "Tony Reichert",
    action: "paid school fees",
    time: "2 mins ago",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: 2,
    user: "Zoey Lang",
    action: "submitted assignment",
    time: "1 hour ago",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: 3,
    user: "Jane Fisher",
    action: "added a new student",
    time: "3 hours ago",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
  },
  {
    id: 4,
    user: "William Howard",
    action: "updated class schedule",
    time: "5 hours ago",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026024d",
  },
];

export const RecentActivity = () => {
  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-0 pt-4 px-4">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription className="text-xs uppercase font-bold">
          Latest updates
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <ul className="flex flex-col gap-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar} alt={activity.user} />
                <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm text-foreground">
                  <span className="font-semibold">{activity.user}</span>{" "}
                  {activity.action}
                </span>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

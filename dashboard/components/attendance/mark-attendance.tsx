"use client";

import React, { useState } from "react";
import { Save, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import { AttendanceStatus } from "@/types/attendance";

// Mock data for classes and students
const CLASSES = [
  { id: "1", name: "Grade 10-A" },
  { id: "2", name: "Grade 10-B" },
  { id: "3", name: "Grade 11-A" },
];

const STUDENTS = [
  {
    id: "s1",
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: "s2",
    name: "Bob Smith",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: "s3",
    name: "Charlie Brown",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
  },
  {
    id: "s4",
    name: "Diana Prince",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
  {
    id: "s5",
    name: "Evan Wright",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c",
  },
];

interface MarkAttendanceProps {
  onSave: (data: any) => void;
}

export const MarkAttendance: React.FC<MarkAttendanceProps> = ({ onSave }) => {
  const { t } = useLanguage();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attendanceData, setAttendanceData] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status as AttendanceStatus,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Saving attendance:", {
      classId: selectedClass,
      date: selectedDate,
      records: attendanceData,
    });
    onSave({
      classId: selectedClass,
      date: selectedDate,
      records: attendanceData,
    });
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <Card className="border">
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end p-6">
          <div className="space-y-2 w-full sm:max-w-xs">
            <Label>{t("select_class")}</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {CLASSES.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full sm:max-w-xs">
            <Label>{t("select_date")}</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      {selectedClass && (
        <div className="grid grid-cols-1 gap-4">
          {STUDENTS.map((student) => (
            <Card
              key={student.id}
              className="border hover:bg-muted/50 transition-colors"
            >
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Avatar className="h-10 w-10">
                    <AvatarImage alt={student.name} src={student.avatar} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">{student.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ID: {student.id.toUpperCase()}
                    </span>
                  </div>
                </div>

                <RadioGroup
                  className="flex gap-4"
                  value={attendanceData[student.id] || "present"}
                  onValueChange={(val) => handleStatusChange(student.id, val)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id={`${student.id}-present`}
                      value="present"
                    />
                    <Label
                      className="text-green-600 font-medium cursor-pointer"
                      htmlFor={`${student.id}-present`}
                    >
                      P
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id={`${student.id}-absent`}
                      value="absent"
                    />
                    <Label
                      className="text-red-600 font-medium cursor-pointer"
                      htmlFor={`${student.id}-absent`}
                    >
                      A
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id={`${student.id}-late`} value="late" />
                    <Label
                      className="text-yellow-600 font-medium cursor-pointer"
                      htmlFor={`${student.id}-late`}
                    >
                      L
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      id={`${student.id}-excused`}
                      value="excused"
                    />
                    <Label
                      className="text-primary font-medium cursor-pointer"
                      htmlFor={`${student.id}-excused`}
                    >
                      E
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedClass && (
        <div className="flex justify-end sticky bottom-6 z-20">
          <Button
            className="shadow-lg"
            disabled={isSaving}
            size="lg"
            onClick={handleSave}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Save className="mr-2 h-5 w-5" />
            )}
            {t("save_attendance")}
          </Button>
        </div>
      )}
    </div>
  );
};

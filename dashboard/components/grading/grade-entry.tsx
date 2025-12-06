"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import { Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const CLASSES = [
  { id: "1", name: "Grade 10-A" },
  { id: "2", name: "Grade 10-B" },
];

const SUBJECTS = [
  { id: "math", name: "Mathematics" },
  { id: "phy", name: "Physics" },
  { id: "eng", name: "English" },
];

const STUDENTS = [
  { id: "s1", name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
  { id: "s2", name: "Bob Smith", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  { id: "s3", name: "Charlie Brown", avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d" },
  { id: "s4", name: "Diana Prince", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d" },
  { id: "s5", name: "Evan Wright", avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c" },
];

export const GradeEntry = () => {
  const { t } = useLanguage();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [assessmentType, setAssessmentType] = useState("exam");
  const [maxScore, setMaxScore] = useState("100");
  const [scores, setScores] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleScoreChange = (studentId: string, value: string) => {
    // Validate number
    if (value === "" || (/^\d*\.?\d*$/.test(value) && Number(value) <= Number(maxScore))) {
      setScores((prev) => ({ ...prev, [studentId]: value }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Saving grades:", {
      classId: selectedClass,
      subjectId: selectedSubject,
      assessmentType,
      scores,
    });
    setIsSaving(false);
    alert("Grades saved successfully!");
  };

  const getGradeLetter = (score: string) => {
    const percentage = Number(score) / Number(maxScore);
    if (percentage >= 0.9) return { letter: "A", color: "text-green-600" };
    if (percentage >= 0.8) return { letter: "B", color: "text-primary" };
    if (percentage >= 0.7) return { letter: "C", color: "text-yellow-600" };
    if (percentage >= 0.6) return { letter: "D", color: "text-orange-600" };
    return { letter: "F", color: "text-red-600" };
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <Card className="border">
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end p-6">
          <div className="space-y-2">
            <Label>{t("select_class")}</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
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
          <div className="space-y-2">
            <Label>{t("subject")}</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("assessment_type")}</Label>
            <Select value={assessmentType} onValueChange={setAssessmentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exam">{t("exam")}</SelectItem>
                <SelectItem value="quiz">{t("quiz")}</SelectItem>
                <SelectItem value="assignment">{t("assignment")}</SelectItem>
                <SelectItem value="project">{t("project")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("max_score")}</Label>
            <Input
              type="number"
              placeholder="100"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Grade Entry Table */}
      {selectedClass && selectedSubject && (
        <div className="flex flex-col gap-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name").toUpperCase()}</TableHead>
                  <TableHead>{t("score").toUpperCase()}</TableHead>
                  <TableHead>{t("grade_letter").toUpperCase()}</TableHead>
                  <TableHead>{t("remarks").toUpperCase()}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STUDENTS.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{student.name}</span>
                          <span className="text-xs text-muted-foreground">ID: {student.id.toUpperCase()}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          type="text"
                          placeholder="0"
                          className="max-w-[80px] h-8"
                          value={scores[student.id] || ""}
                          onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        />
                        <span className="text-muted-foreground text-sm">/{maxScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {scores[student.id] ? (
                        <span className={cn("font-bold", getGradeLetter(scores[student.id]).color)}>
                          {getGradeLetter(scores[student.id]).letter}
                        </span>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Optional remarks"
                        className="max-w-[200px] h-8"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end sticky bottom-6 z-20">
            <Button
              size="lg"
              disabled={isSaving}
              onClick={handleSave}
              className="shadow-lg"
            >
              {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              {t("save_changes")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

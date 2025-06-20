"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "********", // Masked password
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("userFeudjo");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setFormData({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          password: "********", // Keep password masked
        });
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
  }, []);

  const handleEdit = () => setEditing(!editing);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block font-semibold">Email</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block font-semibold">Password</label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <Button onClick={handleEdit} className="mt-3">
              {editing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

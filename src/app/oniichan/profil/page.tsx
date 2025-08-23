"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/admin/dashboard";
import { getUserById, updateUser, deleteUser } from "@/lib/api";
import { UserTypes } from "@/types/user";
import Loading from "@/components/loading/loading";

export default function ProfilePage() {
  const [formData, setFormData] = useState<UserTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("userFeudjo") || "null")
        : null;

    if (storedUser && storedUser.id) {
      getUserById(storedUser.id)
        .then((res) => {
          setFormData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching profile", err);
        })
        .finally(() => setLoading(false));
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (formData && formData._id) {
      try {
        const res = await updateUser(formData._id.toString(), formData);
        localStorage.setItem("userFeudjo", JSON.stringify(res.data));
        alert("Profile updated!");
      } catch (err) {
        console.error("Update error", err);
        alert("Failed to update profile.");
      }
    }
  };

  const handleDelete = async () => {
    if (formData && formData._id) {
      const confirm = window.confirm(
        "Are you sure you want to delete your account?"
      );
      if (confirm) {
        try {
          await deleteUser(formData._id.toString());
          localStorage.removeItem("userFeudjo");
          router.push("/auth/login");
        } catch (err) {
          console.error("Delete error", err);
          alert("Failed to delete account.");
        }
      }
    }
  };

  if (loading || !formData)
    return (
      <div className="flex min-h-screen justify-center bg-primary bg-opacity-5 y-5 items-center">
        <Loading />
      </div>
    );

  return (
    <Dashboard>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">My Profile</h2>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>

              {/* Profile Info Tab */}
              <TabsContent value="info">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={"placeholder.png"} alt="Avatar" />
                    <AvatarFallback>{formData.name}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{formData.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p>
                    <strong>Phone:</strong> {formData.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {formData.address}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  className="mt-6"
                  onClick={handleDelete}
                >
                  Delete account
                </Button>
              </TabsContent>

              {/* Edit Profile Tab */}
              <TabsContent value="edit">
                <div className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      name="fullName"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Avatar URL</Label>
                    <Input
                      name="avatarUrl"
                      value={formData.avatar}
                      onChange={handleChange}
                    />
                  </div>
                  <Button onClick={handleSubmit}>Save changes</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  );
}

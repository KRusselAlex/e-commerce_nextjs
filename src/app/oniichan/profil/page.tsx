"use client"
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/admin/dashboard";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "Alex Russel",
    email: "alex@ecommerce.com",
    phone: "+229 01 46 00 28 15",
    address: "Abomey-Calavi, Bénin",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Updated profile:", formData);
    // You can integrate your backend call here
  };

  return (
    <Dashboard>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Mon Profil</h2>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="edit">Modifier</TabsTrigger>
              </TabsList>
              <TabsContent value="info">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={formData.avatarUrl} alt="Avatar" />
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {formData.fullName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p>
                    <strong>Téléphone:</strong> {formData.phone}
                  </p>
                  <p>
                    <strong>Adresse:</strong> {formData.address}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="edit">
                <div className="space-y-4">
                  <div>
                    <Label>Nom complet</Label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                    />
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Adresse</Label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>URL de l&apos;avatar</Label>
                    <Input
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleChange}
                    />
                  </div>
                  <Button onClick={handleSubmit}>
                    Enregistrer les modifications
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  );
}

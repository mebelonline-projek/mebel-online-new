"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ImageUploader from "@/components/admin/ImageUploader";
import type { SiteSettings, SocialMediaItem } from "@/types";

type SettingsForm = Record<string, unknown>;

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsForm>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) setSettings(data.data as SettingsForm);
    } catch {
      toast.error("Gagal memuat pengaturan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  function update(key: string, value: unknown) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Gagal menyimpan pengaturan");
        return;
      }

      toast.success("Pengaturan berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Brand Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Brand</CardTitle>
          <CardDescription>Informasi brand toko Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Brand</Label>
              <Input
                value={(settings.brandName as string) || ""}
                onChange={(e) => update("brandName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                value={(settings.tagline as string) || ""}
                onChange={(e) => update("tagline", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <ImageUploader
              label="Logo"
              value={(settings.logo as string) || ""}
              onChange={(url) => update("logo", url)}
              folder="settings"
            />
          </div>
        </CardContent>
      </Card>

      {/* Hero */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Banner utama landing page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Judul Hero</Label>
            <Input
              value={(settings.heroTitle as string) || ""}
              onChange={(e) => update("heroTitle", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle Hero</Label>
            <Textarea
              value={(settings.heroSubtitle as string) || ""}
              onChange={(e) => update("heroSubtitle", e.target.value)}
              rows={2}
            />
          </div>
          <ImageUploader
            label="Gambar Hero"
            value={(settings.heroImage as string) || ""}
            onChange={(url) => update("heroImage", url)}
            folder="settings"
          />
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>Tentang Kami</CardTitle>
          <CardDescription>Section tentang toko Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Judul</Label>
            <Input
              value={(settings.aboutTitle as string) || ""}
              onChange={(e) => update("aboutTitle", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Konten</Label>
            <Textarea
              value={(settings.aboutContent as string) || ""}
              onChange={(e) => update("aboutContent", e.target.value)}
              rows={4}
            />
          </div>
          <ImageUploader
            label="Gambar"
            value={(settings.aboutImage as string) || ""}
            onChange={(url) => update("aboutImage", url)}
            folder="settings"
          />
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Kontak</CardTitle>
          <CardDescription>Informasi kontak yang ditampilkan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={(settings.contactEmail as string) || ""}
                onChange={(e) => update("contactEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Telepon</Label>
              <Input
                value={(settings.contactPhone as string) || ""}
                onChange={(e) => update("contactPhone", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Alamat</Label>
            <Textarea
              value={(settings.contactAddress as string) || ""}
              onChange={(e) => update("contactAddress", e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Jam Operasional</Label>
            <Input
              value={(settings.operatingHours as string) || ""}
              onChange={(e) => update("operatingHours", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>URL Map</Label>
            <Input
              value={(settings.contactMapUrl as string) || ""}
              onChange={(e) => update("contactMapUrl", e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp</CardTitle>
          <CardDescription>Konfigurasi tombol WhatsApp</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nomor WhatsApp</Label>
            <Input
              value={(settings.whatsappNumber as string) || ""}
              onChange={(e) => update("whatsappNumber", e.target.value)}
              placeholder="08xxxxxxxxxx"
            />
            <p className="text-xs text-muted-foreground">
              Nomor akan otomatis dikonversi ke format 62xx
            </p>
          </div>
          <div className="space-y-2">
            <Label>Pesan Default</Label>
            <Textarea
              value={(settings.whatsappMessage as string) || ""}
              onChange={(e) => update("whatsappMessage", e.target.value)}
              rows={2}
              placeholder="Halo, saya tertarik dengan produk Anda."
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
          <CardDescription>Informasi di bagian footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Deskripsi Footer</Label>
            <Textarea
              value={(settings.footerDescription as string) || ""}
              onChange={(e) => update("footerDescription", e.target.value)}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email Footer</Label>
              <Input
                value={(settings.footerEmail as string) || ""}
                onChange={(e) => update("footerEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Telepon Footer</Label>
              <Input
                value={(settings.footerPhone as string) || ""}
                onChange={(e) => update("footerPhone", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Alamat Footer</Label>
            <Textarea
              value={(settings.footerAddress as string) || ""}
              onChange={(e) => update("footerAddress", e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Jam Operasional Footer</Label>
            <Input
              value={(settings.footerOperatingHours as string) || ""}
              onChange={(e) => update("footerOperatingHours", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={saving} size="lg" className="bg-maroon hover:bg-maroon-dark">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </div>
    </form>
  );
}
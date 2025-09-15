"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { PromotionFormSchema, PromotionFormValues } from "@/lib/validation/promotionSchemas";
import { Promotion, PromotionCategory, FreeItemSubType } from "@/types/promotions";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PromotionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotion?: Promotion | null;
  onSubmit: (data: PromotionFormValues) => void;
}

export function PromotionForm({ open, onOpenChange, promotion, onSubmit }: PromotionFormProps) {
  const [activeTab, setActiveTab] = useState<PromotionCategory>("free_item");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(PromotionFormSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      category: "free_item",
      freeItemSubType: "drink",
      percentOff: undefined,
      amountOffCents: undefined,
      referral: undefined,
      startAt: "",
      endAt: "",
      maxRedemptions: undefined,
      perUserLimit: undefined,
      status: "draft",
    },
  });

  const watchedCategory = form.watch("category");
  const watchedReferralRewardType = form.watch("referral.rewardType");

  // Update active tab when category changes
  useEffect(() => {
    setActiveTab(watchedCategory);
  }, [watchedCategory]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (promotion) {
        // Edit mode
        form.reset({
          name: promotion.name,
          code: promotion.code || "",
          description: promotion.description || "",
          category: promotion.category,
          freeItemSubType: promotion.freeItemSubType,
          percentOff: promotion.percentOff,
          amountOffCents: promotion.amountOffCents,
          referral: promotion.referral,
          startAt: promotion.startAt || "",
          endAt: promotion.endAt || "",
          maxRedemptions: promotion.maxRedemptions,
          perUserLimit: promotion.perUserLimit,
          status: promotion.status,
        });
        setStartDate(promotion.startAt ? new Date(promotion.startAt) : undefined);
        setEndDate(promotion.endAt ? new Date(promotion.endAt) : undefined);
      } else {
        // Create mode
        form.reset({
          name: "",
          code: "",
          description: "",
          category: "free_item",
          freeItemSubType: "drink",
          percentOff: undefined,
          amountOffCents: undefined,
          referral: undefined,
          startAt: "",
          endAt: "",
          maxRedemptions: undefined,
          perUserLimit: undefined,
          status: "draft",
        });
        setStartDate(undefined);
        setEndDate(undefined);
      }
    }
  }, [open, promotion, form]);

  const handleSubmit = (data: PromotionFormValues) => {
    // Convert dates to ISO strings
    const submitData = {
      ...data,
      startAt: startDate?.toISOString(),
      endAt: endDate?.toISOString(),
    };
    onSubmit(submitData);
  };

  const generateCode = () => {
    const name = form.getValues("name");
    if (name) {
      const code = name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .substring(0, 10);
      form.setValue("code", code);
    }
  };

  const copyReferralLink = () => {
    const code = form.getValues("code") || "PROMO_CODE";
    const link = `${window.location.origin}/r/${code}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied to clipboard");
  };

  const categoryOptions: { value: PromotionCategory; label: string }[] = [
    { value: "free_item", label: "Free Item" },
    { value: "percent_off", label: "Percent Off" },
    { value: "amount_off", label: "Amount Off" },
    { value: "referral", label: "Referral" },
  ];

  const freeItemSubTypeOptions: { value: FreeItemSubType; label: string }[] = [
    { value: "drink", label: "Drink" },
    { value: "snack", label: "Snack" },
    { value: "sweet", label: "Sweet" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {promotion ? "Edit Promotion" : "Create New Promotion"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PromotionCategory)}>
              <TabsList className="grid w-full grid-cols-4">
                {categoryOptions.map((option) => (
                  <TabsTrigger key={option.value} value={option.value}>
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Common Fields */}
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter promotion name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input placeholder="Enter code" {...field} />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={generateCode}
                            >
                              Generate
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter promotion description"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !startDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={(date) => {
                                  setStartDate(date);
                                  field.onChange(date?.toISOString());
                                }}
                                disabled={(date) => endDate ? date > endDate : false}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !endDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={(date) => {
                                  setEndDate(date);
                                  field.onChange(date?.toISOString());
                                }}
                                disabled={(date) => startDate ? date < startDate : false}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxRedemptions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Redemptions</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Unlimited"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="perUserLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Per User Limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Unlimited"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Category-specific fields */}
              <TabsContent value="free_item" className="space-y-4">
                <FormField
                  control={form.control}
                  name="freeItemSubType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Free Item Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select item type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {freeItemSubTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="percent_off" className="space-y-4">
                <FormField
                  control={form.control}
                  name="percentOff"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentage Off *</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            placeholder="10"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                          <span className="flex items-center text-sm text-muted-foreground">%</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="amount_off" className="space-y-4">
                <FormField
                  control={form.control}
                  name="amountOffCents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Off *</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <span className="flex items-center text-sm text-muted-foreground">$</span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="5.00"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Math.round(parseFloat(e.target.value) * 100) : undefined)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="referral" className="space-y-4">
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Referral Configuration</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyReferralLink}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="referral.rewardType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reward Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reward type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percent_off">Percent Off</SelectItem>
                            <SelectItem value="amount_off">Amount Off</SelectItem>
                            <SelectItem value="free_item">Free Item</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedReferralRewardType === "percent_off" && (
                    <FormField
                      control={form.control}
                      name="referral.rewardValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Percentage *</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                placeholder="10"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                              <span className="flex items-center text-sm text-muted-foreground">%</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {watchedReferralRewardType === "amount_off" && (
                    <FormField
                      control={form.control}
                      name="referral.rewardValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount *</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <span className="flex items-center text-sm text-muted-foreground">$</span>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="5.00"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Math.round(parseFloat(e.target.value) * 100) : undefined)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {watchedReferralRewardType === "free_item" && (
                    <FormField
                      control={form.control}
                      name="referral.freeItemSubType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Free Item Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select item type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {freeItemSubTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="referral.maxPerReferrer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Per Referrer</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Unlimited"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="referral.autoApprove"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Auto Approve</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Automatically apply reward after referral
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {promotion ? "Update Promotion" : "Create Promotion"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

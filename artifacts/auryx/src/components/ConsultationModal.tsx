import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateConsultation } from "@workspace/api-client-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  interest: z.string().min(1, "Please select an area of interest"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ConsultationModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const createConsultation = useCreateConsultation();
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: "",
      message: "",
    },
  });

  function onSubmit(values: FormValues) {
    createConsultation.mutate(
      { data: { name: values.name, email: values.email, phone: values.phone, interest: values.interest, message: values.message } },
      {
        onSuccess: () => {
          setSuccessEmail(values.email);
        },
        onError: () => {
          toast({
            title: "Submission failed",
            description: "Please try again or contact us directly.",
            variant: "destructive",
          });
        },
      }
    );
  }

  function handleClose() {
    onOpenChange(false);
    setTimeout(() => {
      setSuccessEmail(null);
      form.reset();
    }, 300);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        {successEmail ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center text-center py-8 px-4 gap-5"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-foreground">Request Received.</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                A member of our concierge team will be in touch shortly. We look forward to speaking with you.
              </p>
            </div>

            <p className="text-sm">
              We'll follow up at{" "}
              <span className="text-primary font-medium">{successEmail}</span>
            </p>

            <Button
              variant="outline"
              onClick={handleClose}
              className="mt-2 border-border/60 text-foreground hover:bg-card/80 px-8"
            >
              Close
            </Button>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-semibold">Request Private Consultation</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter your details below to schedule an initial discussion with our medical team.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="bg-background border-border focus-visible:ring-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" type="email" {...field} className="bg-background border-border focus-visible:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Best Contact Number — SMS or WhatsApp (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" {...field} className="bg-background border-border focus-visible:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="interest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Area of Interest</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-border focus-visible:ring-primary">
                            <SelectValue placeholder="Select a protocol focus" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="anti-aging">Anti-Aging & Longevity</SelectItem>
                          <SelectItem value="fat-loss">Fat Loss & Body Composition</SelectItem>
                          <SelectItem value="sexual-health">Sexual Health & Vitality</SelectItem>
                          <SelectItem value="recovery">Recovery & Regeneration</SelectItem>
                          <SelectItem value="cognitive">Cognitive Performance</SelectItem>
                          <SelectItem value="energy">Energy & Vitality</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Context (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly describe your goals or current protocols..."
                          className="resize-none bg-background border-border focus-visible:ring-primary h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={createConsultation.isPending}>
                    {createConsultation.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

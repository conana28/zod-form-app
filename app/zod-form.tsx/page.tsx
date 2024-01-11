"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "lucide-react";

const FormSchema = z.object({
  rack: z.string({ required_error: "Rack cannot be empty" }),
  shelf: z.string().optional(),
  consume: z.date({
    required_error: "A consume date is required.",
  }),
  cost: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value === undefined) {
          return true; // or false, depending on whether you want to consider undefined as valid or not
        }
        return /^\d{1,3}(?:\.\d{2})?$/.test(value);
      },
      {
        message: "Cost must be in the format $$$.cc",
      }
    ),
  country: z.string(),
});

interface FormProps {
  initialData?: z.infer<typeof FormSchema>;
  setFormType: (type: string) => void;
}

export const ZodForm: React.FC<FormProps> = ({ initialData, setFormType }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Convert cost to cents to store in database
    console.log(
      "Cost: ",
      data.cost !== undefined ? parseFloat(data.cost) * 100 : undefined
    );
    if (initialData) {
      alert("Edit " + JSON.stringify(data, null, 2));
    } else {
      alert("Add " + JSON.stringify(data, null, 2));
    }
    setFormType("");
  }

  return (
    <div className="flex justify-center pt-6">
      <Card className="w-1/2 p-4 bg-slate-500 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div className="flex flex-row space-x-4">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="rack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rack</FormLabel>
                      <FormControl>
                        <Input placeholder="rack.." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="shelf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shelf</FormLabel>
                      <FormControl>
                        <Input placeholder="shelf.." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row space-x-4">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost</FormLabel>
                      {/* <FormControl>
                        <Input type="number" placeholder="cost.." {...field} />
                      </FormControl> */}
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="cost.."
                          {...field}
                          onKeyDown={(event) => {
                            if (
                              !/[0-9]|\./.test(event.key) &&
                              event.key !== "Backspace" &&
                              event.key !== "Delete" &&
                              event.key !== "ArrowLeft" &&
                              event.key !== "ArrowRight"
                            ) {
                              event.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="New Zealand">
                            New Zealand
                          </SelectItem>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Spain">Spain</SelectItem>
                          <SelectItem value="Italy">Italy</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="Greece">Greece</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="consume"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Consume</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-1/2  text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        //   disabled={(date) =>
                        //     date > new Date() || date < new Date("1900-01-01")
                        //   }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {/* <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

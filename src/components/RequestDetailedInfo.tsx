import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { Control } from "react-hook-form";
import type { RequestFormSchema } from "@/schema/requestFormSchema";
import { Textarea } from "./ui/textarea";

export const RequestDetailedInfo = ({
  control,
}: {
  control: Control<RequestFormSchema>;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Detailed Description</CardTitle>
      <CardDescription>
        Provide comprehensive information about the change request
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-4">
      {/* impactCategory */}
      <FormField
        control={control}
        name="impactCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Impact Category *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="High, Medium, Low - Describe the impact category of this change"
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* impactDescription */}
      <FormField
        control={control}
        name="impactDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Impact Description *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe the impact of this project"
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Background */}
      <FormField
        control={control}
        name="background"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Background *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Explain the current situation and why this change is needed"
                rows={4}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* objective */}
      <FormField
        control={control}
        name="objective"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objective *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Define the main objectives and goals of this project"
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* service */}
      <FormField
        control={control}
        name="service"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe the service involved in this project"
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* requiredService */}
      <FormField
        control={control}
        name="requiredService"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Required Service *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe the services required to implement this project"
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  </Card>
);

"use client";

import { Button } from "@/components/ui/button";
import { ZodForm } from "./zod-form.tsx/page";
import { useState } from "react";

export default function Home() {
  const initialData = {
    rack: "Garage",
    consume: new Date(),
    cost: undefined,
    shelf: undefined,
    country: "New Zealand",
  };
  const [formType, setFormType] = useState("");

  return (
    <main>
      <h1 className="text-lg font-bold">Zod Form Test</h1>
      <div className="flex flex-col  mt-4 mb-4">
        <p>
          This is a test of a form using Zod validation. The form is in
          app/zod-form.tsx and includes select for country, calendar for date
          and a formatted input for cost
        </p>
        <p>
          If Add don't pass Initialdata. The form will check for mandatory
          fields and only include others if entered on submit
        </p>
        <p>
          If Edit pass Initialdata. For non mandatory fields set as undefined
          and they will have empty input fields. Only include non mandatory
          imputs if entered
        </p>
      </div>
      <Button
        variant="default"
        className="mr-4"
        onClick={() => setFormType("E")}
      >
        Edit
      </Button>
      {/* Call form component without supplying any initial data */}
      <Button
        variant="default"
        className="mr-4"
        onClick={() => setFormType("A")}
      >
        Add
      </Button>
      <Button variant="default" onClick={() => setFormType("")}>
        Reset
      </Button>
      {formType === "E" && (
        <ZodForm initialData={initialData} setFormType={setFormType} />
      )}
      {/* include initialData  */}
      {formType === "A" && <ZodForm setFormType={setFormType} />} {/*  Empty */}
    </main>
  );
}

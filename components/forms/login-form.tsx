import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input"

export default function LoginForm() {
  return (
     <FieldSet className="w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="username">Email</FieldLabel>
          <Input id="username" type="email" placeholder="example@gmail.com" />
          <FieldDescription>
            Please enter your email address.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

-- Fix: handle_new_user trigger was inserting role='EMPLOYEE' with company_id=NULL,
-- which violates users_hr_employee_company_check (EMPLOYEE/HR must have company_id).
-- Use placeholder role MANAGER + NULL so constraint allows insert; app upserts real role/company_id.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, company_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NULL),
    'MANAGER',
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

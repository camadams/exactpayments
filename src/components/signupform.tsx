import { useForm, type SubmitHandler } from "react-hook-form";

interface FormData {
  username: string;
  password: string;
}

const SignupForm = ({ onSubmit }: { onSubmit: SubmitHandler<FormData> }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  return (
    <form onSubmit={() => handleSubmit(onSubmit)}>
      <div>
        <label>Username</label>
        <input type="text" {...register("username", { required: true })} />
        {errors.username && <span>This field is required</span>}
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register("password", { required: true })} />
        {errors.password && <span>This field is required</span>}
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;

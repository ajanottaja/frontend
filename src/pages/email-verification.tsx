const EmailVerification = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center w-full max-w-96 text-center">
      <h1 className="text-green-300 text-4xl mb-8">
        Email verification
      </h1>
      <p className="text-gray-300">
        An email verification request has been sent to your email address. To
        complete the sign up process, please click the link in the email.
      </p>
    </div>
  );
};

export default EmailVerification;

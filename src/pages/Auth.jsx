const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="card-body">
            <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2 text-center">
              Welcome Back
            </h1>
            <p className="text-secondary-600 mb-6 text-center">
              Sign in to save your chat history (optional)
            </p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email
                </label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Password
                </label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Enter your password"
                />
              </div>
              
              <button type="submit" className="btn-primary w-full">
                Sign In
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-secondary-600 text-sm">
                Don't have an account?{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth 
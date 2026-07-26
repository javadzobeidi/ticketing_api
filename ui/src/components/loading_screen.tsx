import logo from '@/src/assets/images/nezam_logo.jpg'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        {/* Logo container with pulse animation */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Animated rings */}
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-40 animate-pulse"></div>

          {/* Your Logo Image */}
          <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-xl animate-bounce">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-cover rounded-xl p-2"
            />
          </div>
        </div>

        {/* Loading text */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">در حال بارگذاری لطفا صبر کنید</h2>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}
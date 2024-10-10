// 导入语句...
import RightSidebar from '../components/RightSidebar'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            {children}
          </main>
          <RightSidebar />
        </div>
      </body>
    </html>
  )
}
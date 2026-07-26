"use client"

import { useState } from "react"
import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Search, UserPlus, MoreVertical, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { useUsers } from "@/src/lib/useQueries"
import { useNavigate } from "react-router-dom"

// Helper function to generate avatar and color
const getAvatarAndColor = (name: string, index: number) => {
	const colors = [
		"bg-blue-500", "bg-purple-500", "bg-green-500", 
		"bg-pink-500", "bg-orange-500", "bg-teal-500"
	];
	return {
		avatar: name.charAt(0),
		color: colors[index % colors.length]
	};
};

export function UserList() {
	const [searchQuery, setSearchQuery] = useState("")
	const [pageNumber, setPageNumber] = useState(1)
	const [pageSize] = useState(50)
	const navigate=useNavigate();
	// Use React Query to fetch users
	const { data: usersData, isLoading, isError, error } = useUsers(searchQuery, pageNumber, pageSize)
	const users = usersData?.items || []
	const totalCount = usersData?.totalCount || 0
	const totalPages = Math.ceil(totalCount / pageSize)

	console.log(users);
	const handleSearchChange = (value: string) => {
		setSearchQuery(value)
		setPageNumber(1) // Reset to first page when searching
	}

	const handlePageChange = (newPage: number) => {
		setPageNumber(newPage)
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">لیست کاربران</h1>
					<p className="text-muted-foreground mt-1">مدیریت و مشاهده اطلاعات کاربران سیستم</p>
				</div>
				<Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
					<UserPlus className="w-4 h-4" />
					افزودن کاربر جدید
				</Button>
			</div>

			<Card>
				<CardContent className="p-4">
					<div className="relative">
						<Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<Input
							placeholder="جستجو بر اساس نام، ایمیل، شهر یا شعبه..."
							value={searchQuery}
							onChange={(e) => handleSearchChange(e.target.value)}
							className="pr-12 h-12 text-base"
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent>
					{isLoading ? (
						<div className="flex items-center justify-center p-12">
							<Loader2 className="w-8 h-8 animate-spin text-primary" />
							<span className="mr-2 text-muted-foreground">در حال بارگذاری...</span>
						</div>
					) : isError ? (
						<div className="text-center p-12">
							<div className="text-destructive text-lg font-semibold">خطا در بارگذاری داده‌ها</div>
							<p className="text-muted-foreground mt-2">{error?.message || "خطای نامشخص رخ داده است"}</p>
						</div>
					) : (
						<>
							<div className="overflow-x-auto">
								<table className="w-full text-sm text-right">
									<thead className="text-muted-foreground">
										<tr className="border-b">
											<th className="px-4 py-3 font-medium">نام</th>
											<th className="px-4 py-3 font-medium">اطلاعات تماس</th>
											<th className="px-4 py-3 font-medium">موقعیت</th>
											<th className="px-4 py-3 font-medium">نقش</th>
											<th className="px-4 py-3 font-medium">وضعیت</th>
											<th className="px-4 py-3 font-medium">تیکت‌ها</th>
											<th className="px-4 py-3 font-medium"></th>
										</tr>
									</thead>
									<tbody>
										{users.map((user: any, index: number) => {
											const { avatar, color } = getAvatarAndColor(user.name || user.fullName || 'کاربر', index)
											return (
												<tr key={user.id} className="border-b hover:bg-muted/50">
													<td className="px-4 py-3">
														<div className="flex items-center gap-3">
															<div
																className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}
															>
																<span className="text-white font-bold">{avatar}</span>
															</div>
															<span className="font-semibold text-foreground">{user.firstName} {user.lastName}</span>
														</div>
													</td>
													<td className="px-4 py-3">
														<div>{user.email}</div>
														<div className="text-muted-foreground">{user.phone || user.mobile}</div>
													</td>
													<td className="px-4 py-3">
														<div>{user.city || user.cityName}</div>
														<div className="text-muted-foreground">{user.branch || user.branchName}</div>
													</td>
													<td className="px-4 py-3">
														<Badge variant="outline">{user.role }</Badge>
													</td>
													<td className="px-4 py-3">
														<Badge variant={user.status === "فعال" || user.isActive ? "default" : "secondary"}>
															{user.status || (user.isActive ? "فعال" : "غیرفعال")}
														</Badge>
													</td>
													<td className="px-4 py-3 font-semibold text-primary">{user.tickets || user.ticketCount || 0}</td>
													<td className="px-4 py-3 text-center">
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button variant="ghost" size="icon">
																	<MoreVertical className="w-4 h-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuItem>مشاهده جزئیات</DropdownMenuItem>
																<DropdownMenuItem onClick={()=>navigate(`/users/${user.userId}`)}>ویرایش</DropdownMenuItem>
																<DropdownMenuItem className="text-destructive">حذف</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</td>
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>
							{users.length === 0 && !isLoading && (
								<div className="text-center p-12">
									<Search className="w-12 h-12 text-muted-foreground mx-auto" />
									<h3 className="text-lg font-semibold text-foreground mt-4">کاربری یافت نشد</h3>
									<p className="text-muted-foreground mt-2">لطفا عبارت جستجوی دیگری امتحان کنید</p>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div className="text-sm text-muted-foreground">
								نمایش {((pageNumber - 1) * pageSize) + 1} تا {Math.min(pageNumber * pageSize, totalCount)} از {totalCount} کاربر
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(pageNumber - 1)}
									disabled={pageNumber === 1}
									className="gap-1"
								>
									<ChevronRight className="w-4 h-4" />
									قبلی
								</Button>
								
								<div className="flex items-center gap-1">
									{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
										let pageNum;
										if (totalPages <= 5) {
											pageNum = i + 1;
										} else if (pageNumber <= 3) {
											pageNum = i + 1;
										} else if (pageNumber >= totalPages - 2) {
											pageNum = totalPages - 4 + i;
										} else {
											pageNum = pageNumber - 2 + i;
										}
										
										return (
											<Button
												key={pageNum}
												variant={pageNum === pageNumber ? "default" : "outline"}
												size="sm"
												onClick={() => handlePageChange(pageNum)}
												className="w-8 h-8 p-0"
											>
												{pageNum}
											</Button>
										);
									})}
								</div>

								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(pageNumber + 1)}
									disabled={pageNumber === totalPages}
									className="gap-1"
								>
									بعدی
									<ChevronLeft className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

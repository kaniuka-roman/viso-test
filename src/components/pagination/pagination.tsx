import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button/Button'

interface PaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
	const getPageNumbers = () => {
		const pages: (string | number)[] = [1]

		if (totalPages <= 7) {
			for (let i = 2; i <= totalPages; i++) {
				pages.push(i)
			}
		} else {
			if (currentPage <= 4) {
				pages.push(2, 3, 4, 5, 6)
			} else if (currentPage >= totalPages - 3) {
				pages.push(totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1)
			} else {
				pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2)
			}
		}

		if (totalPages > 7) {
			if (currentPage < totalPages - 3) {
				pages.push('...')
			}
			if (!pages.includes(totalPages)) {
				pages.push(totalPages)
			}
		}

		return pages
	}

	const pageNumbers = getPageNumbers()

	return (
		<div className="flex items-center justify-center space-x-2">
			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
			>
				<ChevronLeft className="h-4 w-4" />
				<span className="sr-only">Previous page</span>
			</Button>

			{pageNumbers.map((page, index) => {
				if (page === '...') {
					return (
						<span key={`ellipsis-${index}`} className="px-3 py-2">
							...
						</span>
					)
				}

				const pageNum = page as number
				return (
					<Button
						key={pageNum}
						variant={currentPage === pageNum ? 'default' : 'outline'}
						onClick={() => onPageChange(pageNum)}
						className="h-10 w-10"
					>
						{pageNum}
					</Button>
				)
			})}

			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
				disabled={currentPage === totalPages}
			>
				<ChevronRight className="h-4 w-4" />
				<span className="sr-only">Next page</span>
			</Button>
		</div>
	)
}

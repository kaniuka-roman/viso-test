import { Check, ChevronDown } from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/dropdownMenu/dropdown-menu'
import { Button } from '../ui/button/Button'
import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '@/api/api'

interface CategoryFilterProps {
	selectedCategory: string | null
	onSelectCategory: (category: string | null) => void
}

export const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
	const { data: categories } = useQuery({
		queryKey: ['categories'],
		queryFn: fetchCategories,
	})
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="w-full justify-between md:w-auto">
					{selectedCategory || 'All Categories'}
					<ChevronDown className="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 bg-white">
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => onSelectCategory(null)}
						className="flex cursor-pointer items-center justify-between hover:bg-gray-100"
					>
						All Categories
						{selectedCategory === null && <Check className="ml-2 h-4 w-4" />}
					</DropdownMenuItem>
					{categories?.categories?.map((category) => (
						<DropdownMenuItem
							key={category.strCategory}
							onClick={() => onSelectCategory(category.strCategory)}
							className="flex cursor-pointer items-center justify-between transition-colors hover:bg-gray-100"
						>
							{category.strCategory}
							{selectedCategory === category.strCategory && <Check className="ml-2 h-4 w-4" />}
						</DropdownMenuItem>
					)) ?? []}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

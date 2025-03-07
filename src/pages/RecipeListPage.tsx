import { Button } from '@/components/ui/button/Button'
import { Link } from 'react-router'
import { Search } from 'lucide-react'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { getAllRecipes, getSearchRecipes } from '@/api/api'
import { Pagination } from '@/components/pagination/pagination'
import { RecipeList } from '@/components/RecipeList/RecipeList'
import { useRecipeSelection } from '@/context/RecipeSelectionProvider'
import { CategoryFilter } from '@/components/CategoryFilter/CategoryFilter'
import { Input } from '@/components/ui/input/input'

const recipesPerPage = 8

export default function RecipeListPage() {
	const [searchTerm, setSearchTerm] = useState('')
	const debouncedSearchTerm = useDebounce(searchTerm, 500)
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const { selectedRecipes } = useRecipeSelection()
	const { data: searchResults, isLoading: isSearchLoading } = useQuery({
		queryKey: ['recipes', 'search', debouncedSearchTerm],
		queryFn: () => getSearchRecipes(debouncedSearchTerm),
		enabled: debouncedSearchTerm.length > 0,
	})
	const { data: allRecipes, isLoading: isAllRecipesLoading } = useQuery({
		queryKey: ['recipes', 'all'],
		queryFn: getAllRecipes,
		enabled: debouncedSearchTerm === '',
	})

	const recipes = debouncedSearchTerm.length > 0 ? searchResults || [] : allRecipes || []

	const filteredRecipes = selectedCategory
		? recipes?.filter((recipe) => recipe.strCategory === selectedCategory)
		: recipes

	const totalRecipes = filteredRecipes?.length || 0
	const totalPages = Math.ceil(totalRecipes / recipesPerPage)

	const currentRecipes = filteredRecipes?.slice(
		(currentPage - 1) * recipesPerPage,
		currentPage * recipesPerPage,
	)

	const isLoading = isAllRecipesLoading || isSearchLoading
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
				<h1 className="text-3xl font-bold">Recipe Explorer</h1>

				{selectedRecipes.length > 0 && (
					<Button className="bg-primary hover:bg-primary/90" asChild>
						<Link to={'/selected-recipes'}>View Selected Recipes ({selectedRecipes.length})</Link>
					</Button>
				)}
			</div>

			<div className="mb-8 flex flex-col gap-4 md:flex-row">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transform" />
					<Input
						placeholder="Search recipes..."
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value)
							setCurrentPage(1)
						}}
						className="pl-10"
					/>
				</div>

				<CategoryFilter
					selectedCategory={selectedCategory}
					onSelectCategory={(category) => {
						setSelectedCategory(category)
						setCurrentPage(1)
					}}
				/>
			</div>

			<RecipeList recipes={currentRecipes || []} isLoading={isLoading} />

			{totalPages > 1 && (
				<div className="mt-8">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</div>
			)}
		</div>
	)
}

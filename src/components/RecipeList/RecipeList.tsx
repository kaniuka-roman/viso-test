import { Check, Plus } from 'lucide-react'
import type { Recipe } from '@/types/recipe'
import { useRecipeSelection } from '@/context/RecipeSelectionProvider'
import { Link } from 'react-router'
import { Button } from '../ui/button/Button'
import { Badge } from '../ui/badge/badge'
import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton/skeleton'

interface RecipeListProps {
	recipes: Recipe[]
	isLoading: boolean
}

export const RecipeList = ({ recipes, isLoading }: RecipeListProps) => {
	const { selectedRecipes, addRecipe, removeRecipe } = useRecipeSelection()
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<RecipeCardSkeleton key={i} />
				))}
			</div>
		)
	}

	if (recipes.length === 0) {
		return (
			<div className="py-12 text-center">
				<h2 className="mb-2 text-2xl font-semibold">No recipes found</h2>
				<p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{recipes.map((recipe) => {
				const isSelected = selectedRecipes.some((r) => r.idMeal === recipe.idMeal)

				return (
					<div key={recipe.idMeal} className="bg-card overflow-hidden rounded-lg border">
						<Link to={`/recipe/${recipe.idMeal}`} className="relative block h-72 overflow-clip">
							<img
								src={recipe.strMealThumb || '/placeholder.svg'}
								alt={recipe.strMeal}
								className="w-full object-cover transition-transform duration-700 hover:scale-105"
							/>
						</Link>
						<div className="p-4">
							<Link to={`/recipe/${recipe.idMeal}`}>
								<h2 className="hover:text-primary mb-2 line-clamp-1 text-xl font-semibold transition-colors">
									{recipe.strMeal}
								</h2>
							</Link>
							<div className="mb-4 flex flex-wrap gap-2">
								<Badge variant="outline">{recipe.strCategory}</Badge>
								<Badge variant="outline">{recipe.strArea}</Badge>
							</div>
							<div className="flex items-center gap-2">
								<Button variant="outline" className="flex-1 " asChild>
									<Link to={`/recipe/${recipe.idMeal}`}>View Details</Link>
								</Button>
								<Button
									variant={isSelected ? 'default' : 'secondary'}
									className={cn(
										'cursor-pointer',
										isSelected ? 'bg-green-600 hover:bg-green-700' : '',
									)}
									onClick={() => (isSelected ? removeRecipe(recipe.idMeal) : addRecipe(recipe))}
									size="icon"
								>
									{isSelected ? (
										<Check className="h-4 w-4 stroke-white" />
									) : (
										<Plus className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

function RecipeCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-lg border">
			<Skeleton className="h-48 w-full" />
			<div className="p-4">
				<Skeleton className="mb-2 h-6 w-3/4" />
				<div className="mb-4 flex gap-2">
					<Skeleton className="h-5 w-20" />
					<Skeleton className="h-5 w-20" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-10 flex-1" />
					<Skeleton className="h-10 w-10" />
				</div>
			</div>
		</div>
	)
}

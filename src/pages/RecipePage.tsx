import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Check, Plus } from 'lucide-react'
import { fetchRecipeById } from '@/api/api'
import { useRecipeSelection } from '@/context/RecipeSelectionProvider'
import { Link, useParams } from 'react-router'
import { Button } from '@/components/ui/button/Button'
import { Badge } from '@/components/ui/badge/badge'
import { Skeleton } from '@/components/ui/skeleton/skeleton'

export default function RecipePage() {
	const { recipeId } = useParams()
	console.log(' RecipePage ~ id:', recipeId)

	const { data: recipeData, isLoading } = useQuery({
		queryKey: ['recipe', recipeId],
		queryFn: () => fetchRecipeById(recipeId),
		enabled: !!recipeId,
	})

	const { selectedRecipes, addRecipe, removeRecipe } = useRecipeSelection()
	const recipe = recipeData?.meals?.[0]

	const isSelected = selectedRecipes.some((r) => r.idMeal === recipeId)

	// Extract ingredients and measurements
	const ingredients = recipe
		? Array.from({ length: 20 }, (_, i) => i + 1)
				.map((index) => {
					const ingredient = recipe[`strIngredient${index}` as keyof typeof recipe] as string
					const measure = recipe[`strMeasure${index}` as keyof typeof recipe] as string

					if (ingredient && ingredient.trim()) {
						return { ingredient, measure: measure?.trim() || '' }
					}
					return null
				})
				.filter(Boolean)
		: []

	if (isLoading) {
		return <RecipePageSkeleton />
	}

	if (!recipe) {
		return (
			<div className="container mx-auto px-4 py-16 text-center">
				<h1 className="mb-4 text-3xl font-bold">Recipe not found</h1>
				<Link to="/">
					<Button>Back to recipes</Button>
				</Link>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<Link to="/" className="text-primary inline-flex items-center hover:underline">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to recipes
				</Link>
			</div>

			<div className="flex flex-col gap-8 lg:flex-row">
				<div className="lg:w-1/2">
					<div className="relative aspect-square overflow-hidden rounded-lg">
						<img
							src={recipe.strMealThumb || '/placeholder.svg'}
							alt={recipe.strMeal}
							className="h-full w-full object-cover"
						/>
					</div>

					<div className="mt-6 flex flex-wrap gap-2">
						<Badge variant="outline" className="text-sm">
							Category: {recipe.strCategory}
						</Badge>
						<Badge variant="outline" className="text-sm">
							Area: {recipe.strArea}
						</Badge>
						{recipe.strTags &&
							recipe.strTags.split(',').map((tag) => (
								<Badge key={tag} variant="secondary" className="text-sm">
									{tag.trim()}
								</Badge>
							))}
					</div>

					<div className="mt-6">
						<Button
							onClick={() => (isSelected ? removeRecipe(recipe.idMeal) : addRecipe(recipe))}
							className={isSelected ? 'bg-green-600 text-white hover:bg-green-700' : ''}
						>
							{isSelected ? (
								<>
									<Check className="mr-2 h-4 w-4" />
									Added to selection
								</>
							) : (
								<>
									<Plus className="mr-2 h-4 w-4" />
									Add to selection
								</>
							)}
						</Button>
					</div>
				</div>

				<div className="lg:w-1/2">
					<h1 className="mb-4 text-3xl font-bold">{recipe.strMeal}</h1>

					<div className="mb-6">
						<h2 className="mb-3 text-xl font-semibold">Ingredients</h2>
						<ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
							{ingredients.map((item, index) => (
								<li key={index} className="flex items-start gap-2">
									<span className="font-medium">{item?.measure}</span>
									<span>{item?.ingredient}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="mb-6">
						<h2 className="mb-3 text-xl font-semibold">Instructions</h2>
						<div className="space-y-4">
							{recipe.strInstructions.split('\r\n\r\n').map((paragraph, index) => (
								<p key={index}>{paragraph}</p>
							))}
						</div>
					</div>

					{recipe.strYoutube && (
						<div className="mb-6">
							<h2 className="mb-3 text-xl font-semibold">Video Tutorial</h2>
							<div className="aspect-video">
								<iframe
									width="100%"
									height="100%"
									src={`https://www.youtube.com/embed/${recipe.strYoutube.split('v=')[1]}`}
									title="YouTube video player"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="rounded-lg"
								></iframe>
							</div>
						</div>
					)}

					{recipe.strSource && (
						<div>
							<h2 className="mb-3 text-xl font-semibold">Source</h2>
							<a
								href={recipe.strSource}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Original Recipe
							</a>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

function RecipePageSkeleton() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<Skeleton className="h-6 w-32" />
			</div>

			<div className="flex flex-col gap-8 lg:flex-row">
				<div className="lg:w-1/2">
					<Skeleton className="aspect-video w-full rounded-lg" />
					<div className="mt-6 flex gap-2">
						<Skeleton className="h-6 w-24" />
						<Skeleton className="h-6 w-24" />
					</div>
					<div className="mt-6">
						<Skeleton className="h-10 w-40" />
					</div>
				</div>

				<div className="lg:w-1/2">
					<Skeleton className="mb-4 h-10 w-3/4" />

					<div className="mb-6">
						<Skeleton className="mb-3 h-8 w-32" />
						<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
							{Array.from({ length: 8 }).map((_, i) => (
								<Skeleton key={i} className="h-6 w-full" />
							))}
						</div>
					</div>

					<div className="mb-6">
						<Skeleton className="mb-3 h-8 w-32" />
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="mb-2 h-6 w-full" />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

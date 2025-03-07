import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card/card'
import type { Recipe } from '@/types/recipe'
import { Badge } from '../ui/badge/badge'
import { Button } from '../ui/button/Button'
import { Link } from 'react-router'

interface SelectedRecipeCardProps {
	recipe: Recipe
	onRemove: (id: string) => void
}

export const SelectedRecipeCard = ({ recipe, onRemove }: SelectedRecipeCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false)

	// Get ingredients for a recipe
	const getRecipeIngredients = (recipe: Recipe) => {
		const ingredients = []

		for (let i = 1; i <= 20; i++) {
			const ingredient = recipe[`strIngredient${i}` as keyof typeof recipe] as string
			const measure = recipe[`strMeasure${i}` as keyof typeof recipe] as string

			if (ingredient && ingredient.trim()) {
				ingredients.push({
					ingredient: ingredient.trim(),
					measure: measure?.trim() || '',
				})
			}
		}

		return ingredients
	}

	const ingredients = getRecipeIngredients(recipe)

	return (
		<Card
			className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg' : 'shadow'}`}
		>
			<div
				className="flex cursor-pointer flex-col md:flex-row"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="relative h-48 md:h-auto md:w-1/4">
					<img
						src={recipe.strMealThumb || '/placeholder.svg'}
						alt={recipe.strMeal}
						className="object-cover"
					/>
				</div>

				<div className="flex-1 p-6">
					<div className="flex items-start justify-between">
						<div>
							<h2 className="mb-2 text-2xl font-semibold">{recipe.strMeal}</h2>
							<div className="mb-4 flex flex-wrap gap-2">
								<Badge variant="outline">{recipe.strCategory}</Badge>
								<Badge variant="outline">{recipe.strArea}</Badge>
								{recipe.strTags &&
									recipe.strTags.split(',').map((tag) => (
										<Badge key={tag} variant="secondary" className="text-sm">
											{tag.trim()}
										</Badge>
									))}
							</div>
						</div>
						<div className="flex items-center gap-2">
							{isExpanded ? (
								<ChevronUp className="text-muted-foreground h-5 w-5" />
							) : (
								<ChevronDown className="text-muted-foreground h-5 w-5" />
							)}
						</div>
					</div>

					<div className="mt-4">
						<h3 className="mb-2 text-lg font-medium">Ingredients</h3>
						<ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
							{ingredients.slice(0, isExpanded ? ingredients.length : 6).map((item, index) => (
								<li key={index} className="flex items-start gap-2 text-sm">
									<span className="font-medium">{item.measure}</span>
									<span>{item.ingredient}</span>
								</li>
							))}
							{!isExpanded && ingredients.length > 6 && (
								<li className="text-muted-foreground text-sm">
									+ {ingredients.length - 6} more ingredients
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>

			<div className="bg-muted/30 flex justify-end gap-2 border-t px-6 py-4">
				<Button
					variant="destructive"
					size="sm"
					onClick={(e) => {
						e.stopPropagation()
						onRemove(recipe.idMeal)
					}}
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Remove
				</Button>
				<Link to={`/recipe/${recipe.idMeal}`} onClick={(e) => e.stopPropagation()}>
					<Button variant="outline" size="sm">
						<ExternalLink className="mr-2 h-4 w-4" />
						View Recipe
					</Button>
				</Link>
			</div>
			{isExpanded && (
				<div className="border-t px-6 py-4">
					<h3 className="mb-3 text-xl font-medium">Instructions</h3>
					<div className="space-y-4">
						{recipe.strInstructions ? (
							recipe.strInstructions
								.split('\r\n\r\n')
								.map((paragraph, index) => <p key={index}>{paragraph}</p>)
						) : (
							<p>No instructions available.</p>
						)}
					</div>

					{recipe.strYoutube && (
						<div className="mt-6">
							<h3 className="mb-3 text-lg font-medium">Video Tutorial</h3>
							<div className="aspect-video">
								<iframe
									width="100%"
									height="100%"
									src={`https://www.youtube.com/embed/${recipe.strYoutube.split('v=')[1] || ''}`}
									title="YouTube video player"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="rounded-lg"
								></iframe>
							</div>
						</div>
					)}
				</div>
			)}
		</Card>
	)
}

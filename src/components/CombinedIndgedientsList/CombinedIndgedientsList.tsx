import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card/card'
import type { Recipe } from '@/types/recipe'
import { Button } from '../ui/button/Button'

interface CombinedIngredientsListProps {
	recipes: Recipe[]
	initialExpanded?: boolean
	onToggleExpand?: (isExpanded: boolean) => void
}

export const CombinedIngredientsList = ({
	recipes,
	initialExpanded = false,
	onToggleExpand,
}: CombinedIngredientsListProps) => {
	const [isExpanded, setIsExpanded] = useState(initialExpanded)

	const toggleExpanded = () => {
		const newExpandedState = !isExpanded
		setIsExpanded(newExpandedState)
		if (onToggleExpand) {
			onToggleExpand(newExpandedState)
		}
	}

	// Combine all ingredients from selected recipes
	const getCombinedIngredients = () => {
		const ingredientData: { [key: string]: { measures: string[]; recipes: string[] } } = {}
		recipes.forEach((recipe) => {
			for (let i = 1; i <= 20; i++) {
				const ingredient = recipe[`strIngredient${i}` as keyof typeof recipe] as string
				const measure = recipe[`strMeasure${i}` as keyof typeof recipe] as string
				if (ingredient && ingredient.trim()) {
					const key = ingredient.toLowerCase().trim()
					if (!ingredientData[key]) ingredientData[key] = { measures: [], recipes: [] }
					const entry = ingredientData[key]
					if (measure && measure.trim()) {
						entry.measures.push(measure.trim())
					}

					if (!entry.recipes.includes(recipe.strMeal)) {
						entry.recipes.push(recipe.strMeal)
					}
				}
			}
		})

		return Object.entries(ingredientData).map(([ingredient, { measures, recipes }]) => ({
			ingredient,
			measures,
			recipes,
		}))
	}

	const combinedIngredients = getCombinedIngredients()

	return (
		<div className="border-t pb-16 pt-8">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-2xl font-semibold">Combined Ingredients List</h2>
				<Button
					variant="ghost"
					size="sm"
					onClick={toggleExpanded}
					className="flex items-center gap-2"
				>
					{isExpanded ? (
						<>
							<ChevronUp className="h-4 w-4" />
							Hide Ingredients
						</>
					) : (
						<>
							<ChevronDown className="h-4 w-4" />
							Show Ingredients
						</>
					)}
				</Button>
			</div>

			{isExpanded && (
				<Card>
					<CardContent className="pt-6">
						<div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
							{combinedIngredients.map((item, index) => (
								<div key={index} className="flex items-start py-2">
									<div className="min-w-32 font-medium">{item.ingredient}</div>
									<div className="flex-1">
										<div>{item.measures.join(', ')}</div>
										<div className="text-muted-foreground mt-1 text-xs">
											Used in: {item.recipes.join(', ')}
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{!isExpanded && (
				<p className="text-muted-foreground">
					Click "Show Ingredients" to view the combined ingredients list for all selected recipes.
				</p>
			)}
		</div>
	)
}

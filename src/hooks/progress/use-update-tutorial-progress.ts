import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import useAuthentication from 'hooks/use-authentication'
// Tutorial progress utilities
import { progressLabelToPercent } from 'lib/learn-client/api/progress/formatting'
import { useTutorialProgress } from './use-tutorial-progress'
import { useTutorialProgressMutations } from './use-tutorial-progress-mutations'
// Types
import {
	TutorialIdCollectionId,
	TutorialProgressLabel,
} from 'lib/learn-client/types'
import { TutorialProgressArgs } from './use-tutorial-progress-mutations/types'

type IntersectionRef = (node?: Element) => void

interface UpdateProgressReturnInterface {
	startRef: IntersectionRef
	endRef: IntersectionRef
}

/**
 * Given a tutorialId and collectionId,
 * Return two refs in an object, { startRef, endRef },
 * which can be placed on elements to track tutorial progress.
 *
 * On initial load, regardless of startRef or endRef visibility,
 * if the tutorial does not yet have recorded progress,
 * the tutorial will be marked as `visited` (0 percent).
 *
 * When the startRef element moves out of the viewport,
 * the tutorial will be marked as `in_progress` (50 percent).
 *
 * When the endRef element moves into the viewport,
 * the tutorial will be marked as `complete` (100 percent).
 */
export function useUpdateTutorialProgress({
	tutorialId,
	collectionId,
}: TutorialIdCollectionId): UpdateProgressReturnInterface {
	// We don't try to update progress unless we're authenticated
	const { isAuthenticated } = useAuthentication()
	// We need to know if progress exists, to know whether to "create" or "update"
	const { tutorialProgressLabel } = useTutorialProgress({
		tutorialId,
		collectionId,
	})
	// `react-query` mutations are what we'll use to "create" or "update" progress
	const tutorialProgressMutations = useTutorialProgressMutations()
	// We don't want to run multiple mutations at once
	const [isRunningMutation, setIsRunningMutation] = useState<boolean>(false)

	// We pass these progress-tracking refs to the consumer
	const [startRef, startInView] = useInView()
	const [endRef, endInView] = useInView()

	/**
	 * When relevant state changes, we ensure tutorial progress is reflected
	 * accurately by calling tutorial progress mutations.
	 */
	useEffect(() => {
		/**
		 * If we don't have the tutorial and collection ids we need,
		 * or if we're not authenticated,
		 * or if we already in the middle of a mutation,
		 * then bail early
		 */
		const hasIds = tutorialId && collectionId
		if (!hasIds || !isAuthenticated || isRunningMutation) {
			return
		}
		/**
		 * Determine the new progress state, which we'll then update
		 * - 'complete' (100%) if the end ref is visible
		 * - 'in_progress' (50%) if the start content ref is no longer visible
		 * - 'visited' (0%) in all other cases
		 */
		let newProgressLabel: TutorialProgressLabel
		if (endInView) {
			newProgressLabel = TutorialProgressLabel.complete
		} else if (!startInView) {
			newProgressLabel = TutorialProgressLabel.in_progress
		} else {
			newProgressLabel = TutorialProgressLabel.visited
		}
		/**
		 * If we have positive progress, or need to record initial progress,
		 * then we create or update our progress (formatted as percent for the API).
		 *
		 * Note that we don't ever downgrade the percent value of progress.
		 */
		const existingPercent = progressLabelToPercent(tutorialProgressLabel)
		const newPercent = progressLabelToPercent(newProgressLabel)
		const hasPositiveProgress = parseInt(newPercent) > parseInt(existingPercent)
		const needsInitialProgress = tutorialProgressLabel === null
		if (needsInitialProgress || hasPositiveProgress) {
			/**
			 * We'll use the same mutation arguments for "create" or "update".
			 *
			 * Note: We need to ensure we don't fire off multiple updates at once,
			 * so we setIsRunningMutation(true) as we start the mutation, and once
			 * the mutation has settled successfully, we setIsRunningMutation(false).
			 *
			 * Note that we do not setIsRunningMutation(true) if the mutation failed,
			 * as this can cause an infinite loop of retries.
			 */
			setIsRunningMutation(true)
			const mutationArgs: TutorialProgressArgs = {
				tutorialId,
				collectionId,
				completePercent: newPercent,
				options: {
					onError: (error) => {
						/**
						 * TODO: we could improve error handling here.
						 * Maybe with window.DD_RUM.addError(error)?
						 */
						console.error(`Failed to update progress. Error:`)
						console.error(error)
					},
					onSuccess: () => {
						setIsRunningMutation(false)
					},
				},
			}
			/**
			 * If we need an initial progress record, we create a new record.
			 * Otherwise, we'll update the existing record.
			 */
			if (needsInitialProgress) {
				tutorialProgressMutations.createTutorialProgress(mutationArgs)
			} else {
				tutorialProgressMutations.updateTutorialProgress(mutationArgs)
			}
		}
	}, [
		endInView,
		tutorialId,
		collectionId,
		isAuthenticated,
		isRunningMutation,
		startInView,
		tutorialProgressLabel,
		tutorialProgressMutations,
	])

	return { startRef, endRef }
}

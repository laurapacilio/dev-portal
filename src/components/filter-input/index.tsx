import { ChangeEvent, useRef } from 'react'
import { IconFilter16 } from '@hashicorp/flight-icons/svg-react/filter-16'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import s from './filter-input.module.css'

interface FilterInputProps {
	placeholder?: string
	value: string
	onChange: (newValue: string) => void
}

const FilterInput: React.FC<FilterInputProps> = ({
	placeholder,
	value,
	onChange,
}) => {
	const inputRef = useRef<HTMLInputElement>()
	const showClearButton = value

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value
		onChange(newValue)
	}

	const handleClear = () => {
		onChange('')
		inputRef.current.focus()
	}

	return (
		<div className={s.filterInputContainer}>
			<IconFilter16 className={s.filterIcon} />
			<input
				className={s.filterInput}
				onChange={handleChange}
				placeholder={placeholder ?? 'Filter'}
				ref={inputRef}
				value={value}
			/>
			{showClearButton && (
				<button
					aria-label="Clear filter"
					className={s.clearButton}
					onClick={handleClear}
				>
					<IconX16 className={s.clearIcon} />
				</button>
			)}
		</div>
	)
}

export default FilterInput

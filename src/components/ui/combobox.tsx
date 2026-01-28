"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
    options: string[]
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    emptyText?: string
    className?: string
    disabled?: boolean
}

export function Combobox({
    options,
    value,
    onValueChange,
    placeholder = "Select...",
    emptyText = "No results found.",
    className,
    disabled = false
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(value)

    React.useEffect(() => {
        setInputValue(value)
    }, [value])

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
    )

    const handleSelect = (selectedValue: string) => {
        onValueChange(selectedValue)
        setInputValue(selectedValue)
        setOpen(false)
    }

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue)
        onValueChange(newValue)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between rounded-xl h-12", className)}
                    disabled={disabled}
                >
                    <span className={cn("truncate", !inputValue && "text-muted-foreground")}>
                        {inputValue || placeholder}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={`Search or type ${placeholder.toLowerCase()}...`}
                        value={inputValue}
                        onValueChange={handleInputChange}
                    />
                    <CommandEmpty>{emptyText}</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                        {filteredOptions.map((option) => (
                            <CommandItem
                                key={option}
                                value={option}
                                onSelect={() => handleSelect(option)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

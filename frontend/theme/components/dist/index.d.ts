import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { ButtonProps } from './ButtonProps';
import { ClassProp } from 'class-variance-authority/dist/types';
import { default as default_2 } from 'react';
import { FC } from 'react';
import * as IconMap from 'lucide-react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { OTPInput } from 'input-otp';
import { OverlayTriggerProps } from 'react-bootstrap';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React_2 from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { Toaster } from '../../components/ui/sonner';
import { VariantProps } from 'class-variance-authority';

export declare function Accordion({ ...props }: React_2.ComponentProps<typeof AccordionPrimitive.Root>): any;

export declare function AccordionContent({ className, children, ...props }: React_2.ComponentProps<typeof AccordionPrimitive.Content>): any;

export declare function AccordionItem({ className, ...props }: React_2.ComponentProps<typeof AccordionPrimitive.Item>): any;

export declare function AccordionTrigger({ className, children, ...props }: React_2.ComponentProps<typeof AccordionPrimitive.Trigger>): any;

declare type Action = {
    type: string;
    params: string;
};

export declare const Approver: default_2.FC<Props_4>;

export declare function Avatar({ className, ...props }: React_2.ComponentProps<typeof AvatarPrimitive.Root>): any;

export declare function AvatarFallback({ className, ...props }: React_2.ComponentProps<typeof AvatarPrimitive.Fallback>): any;

export declare function AvatarImage({ className, ...props }: React_2.ComponentProps<typeof AvatarPrimitive.Image>): any;

export declare function Badge({ className, variant, asChild, ...props }: React_2.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
}): any;

declare const badgeVariants: (props?: {
    variant?: "default" | "destructive" | "outline" | "secondary";
} & ClassProp) => string;

export declare function Button({ label, loading, onClick, className, type, icon, ...props }: ButtonProps): any;

export declare function CancelButton({ label, loading, onClick, className, ...props }: ButtonProps): any;

export declare function Card({ children, title, collapsible, isCollapsed, className, cardBodyClassName, subTitle, count, customHeaderComponents, table, filterCallback, filterLabel, refreshCallback, totalElements, currentElement, pagingCallback, pageSize, showPaging, }: CardProps): any;

declare type CardProps = {
    label?: string;
    onClick?: () => void;
    className?: string;
    children?: default_2.Component;
    title?: string;
    collapsible?: boolean;
    isCollapsed: boolean;
    cardBodyClassName?: string;
    subTitle?: string;
    count?: number;
    customHeaderComponents?: default_2.Component;
    table?: boolean;
    filterCallback?: () => void;
    filterLabel?: () => void;
    refreshCallback?: () => void;
    totalElements?: number;
    currentElement?: number;
    pagingCallback?: () => void;
    pageSize?: number;
    showPaging?: boolean;
} & default_2.ComponentProps<'div'>;

export declare const chartColors: string[];

export declare function Col({ children, span, md, lg, xl, className, padding, }: ColProps & React_2.ComponentProps<"div">): any;

export declare function CollapsibleText({ title, subTitle, isCollapsed, collapsible, children, count, }: any): any;

declare interface ColProps {
    children?: React_2.ReactNode;
    span?: string;
    md?: string;
    lg?: string;
    xl?: string;
    className?: string;
    padding?: boolean;
}

declare type Condition = {
    field: string;
    operator: string;
    value: string;
};

export declare function ConfirmToggle({ id, checked, children, callback, ...props }: default_2.ComponentProps<'input'>): any;

export declare function CustomCheckbox({ id, label, name, placeholder, value, onChange, tooltip, error, type, direction, ...props }: any): any;

export declare function CustomDatePicker({ id, type, name, className, onChange, label, isError, tooltip, direction, disabled, error, value, gap, ...props }: CustomInputProps): any;

export declare function CustomDateRangePicker({ id, type, name, className, onChange, label, isError, tooltip, direction, disabled, error, value, gap, ...props }: CustomInputProps): any;

export declare function CustomInput({ id, type, name, className, onChange, label, isError, tooltip, direction, disabled, error, value, gap, ...props }: CustomInputProps): any;

declare interface CustomInputProps {
    id?: string;
    placeholder?: string;
    value?: string;
    type?: string;
    name?: string;
    className?: string;
    onChange?: (e: any) => void;
    label?: string;
    isError?: boolean;
    error?: string;
    disabled?: boolean;
    direction?: string;
    tooltip?: string;
    gap?: string;
}

export declare function CustomSelect({ id, label, name, placeholder, value, onChange, tooltip, error, type, url, data, dataMap, args, className, backEndCallType, customButtons, ...props }: CustomSelectProps & React_2.ComponentProps<"input">): any;

declare interface CustomSelectProps {
    id?: string;
    label?: string;
    name?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: any) => void;
    tooltip?: string;
    error?: string;
    type?: string;
    url?: string;
    data?: {} | any;
    dataMap?: [] | any[];
    className?: string;
    backEndCallType?: string;
    customButtons?: [] | any;
    args?: {} | any;
}

declare interface CustomSelectProps_2 {
    id?: string;
    label?: string;
    name?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: any) => void;
    tooltip?: string;
    error?: string;
    type?: string;
    url?: string;
    data?: [] | any;
    className?: string;
}

export declare function CustomTextArea({ id, type, name, className, onChange, label, isError, tooltip, direction, disabled, error, value, gap, ...props }: CustomInputProps): any;

export declare const DateInput: default_2.FC<DateInputProps>;

declare interface DateInputProps {
    value?: Date;
    onChange: (date: Date) => void;
}

declare interface DateRange {
    from: Date;
    to: Date | undefined;
}

/** The DateRangePicker component allows a user to select a range of dates */
export declare const DateRangePicker: FC<DateRangePickerProps> & {
    filePath: string;
};

declare interface DateRangePickerProps {
    /** Click handler for applying the updates from DateRangePicker. */
    onUpdate?: (values: {
        range: DateRange;
        rangeCompare?: DateRange;
    }) => void;
    /** Initial value for start date */
    initialDateFrom?: Date | string;
    /** Initial value for end date */
    initialDateTo?: Date | string;
    /** Initial value for start date for compare */
    initialCompareFrom?: Date | string;
    /** Initial value for end date for compare */
    initialCompareTo?: Date | string;
    /** Alignment of popover */
    align?: 'start' | 'center' | 'end';
    /** Option for locale */
    locale?: string;
    /** Option for showing compare feature */
    showCompare?: boolean;
    value?: {
        range: DateRange;
        rangeCompare?: DateRange;
    };
}

export declare function DeleteButton({ children, callback, title, desc, loading, ...props }: DeleteButtonProps & default_2.ComponentProps<'button'>): any;

declare interface DeleteButtonProps {
    children: default_2.ReactNode;
    callback: () => void;
    title?: string;
    desc?: string;
}

export declare function Divider({ className, orientation, decorative, }: DividerProps & React_2.ComponentProps<'div'>): any;

declare interface DividerProps {
    orientation?: string;
    decorative?: string;
    className?: string;
}

export declare function EditButton({ label, loading, onClick, className, ...props }: ButtonProps): any;

export declare function FilterBadge({ label, count, active, onClick, }: {
    label: string;
    count: number;
    active?: boolean;
    onClick?: () => void;
}): any;

export declare const FullWidthSubmitButton: ({ label, loading, onClick, className, ...props }: ButtonProps) => any;

declare interface Group {
    module: string;
    menuName: string;
    children: MenuItem[];
}

export declare function H1({ children }: any): any;

export declare function H3({ children }: any): any;

export declare function Heading({ children, title, subHeading, subTitle, center, className, }: default_2.ComponentProps<'div'>): any;

export declare function IconButton({ icon, onClick, className }: ButtonProps): any;

declare type IconName = keyof typeof IconMap;

declare interface IconProps {
    name?: IconName;
    className?: string;
    size?: number;
    icon?: IconName;
}

export declare const Icons: ({ name, className, size, icon }: IconProps) => any;

export declare const InfoItem: default_2.FC<InfoItemProps>;

declare interface InfoItemProps {
    title: string;
    children: default_2.ReactNode;
    className?: string;
}

export declare function InlineBorderedCard({ children, padding, gap, margin, className, }: {
    children: any;
    padding?: boolean;
    gap?: string;
    margin?: boolean;
    className?: string;
}): any;

export declare function InlineInput({ type, name, className, onChange, id, value, }: CustomInputProps): any;

export declare function InlineLoadingComponent(): any;

export declare function InlineSelect({ data, callback, selectedValue, labelComponent, toolTipMessage, toolTiplocation, }: any & React_2.ComponentProps<'div'>): any;

export declare function InlineStatusText({ variant, text, className, }: React_2.ComponentProps<'p'>): any;

export declare function InputHelper({ text, variant }: InputHelperProps): any;

declare interface InputHelperProps {
    id?: string;
    text?: string;
    variant?: string;
}

export declare function InputOTP({ className, containerClassName, ...props }: React_2.ComponentProps<typeof OTPInput> & {
    containerClassName?: string;
}): any;

export declare function InputOTPGroup({ className, ...props }: React_2.ComponentProps<'div'>): any;

export declare function InputOTPSeparator({ ...props }: React_2.ComponentProps<'div'>): any;

export declare function InputOTPSlot({ index, className, ...props }: React_2.ComponentProps<'div'> & {
    index: number;
}): any;

export declare function KeyvalueBlock({ label, value }: {
    label: any;
    value: any;
}): any;

export declare function Label({ className, ...props }: React_2.ComponentProps<typeof LabelPrimitive.Root>): any;

export declare function LoadingComponent({ text, }: React_2.ComponentProps<'div'>): any;

declare interface MenuItem {
    menuName: string;
    path?: string;
    icons?: string;
    showInMenu?: boolean;
    children?: MenuItem[];
}

export declare function ModulesSwitcher({ teams, }: {
    teams: {
        name: string;
        logo?: React_2.ElementType;
        plan: string;
        icon?: IconName;
    }[];
}): any;

export declare function MutedBgLayout({ children }: React_2.ReactNode): any;

export declare function NavMain({ items, callback, }: {
    items: Group[];
    callback: (e: any) => void;
}): any;

export declare function NavUser({ user, callback, }: {
    user: {
        name: string;
        role: string;
        avatar: string;
    };
    callback: (e: any) => void;
}): any;

export declare function NewButton({ label, loading, onClick, className, ...props }: ButtonProps): any;

export declare function NGPBar({ children, size, show, barData, dataKey, dataValue, colorIndex }: any): any;

export declare function NGPHeatMap(): any;

export declare function NGPLine({ children, size, show, lineData, dataKey, dataValue, height, }: any): any;

export declare function NGPMultiBar({ children, size, show, barData, dataKey, dataValue, colorIndex }: any): any;

export declare function NGPPieRoundedCorner({ size, show, pieData, isAnimationActive }: any): any;

export declare function NGPRadar({ children, size, show, radarData, dataKey, dataValue, }: any): any;

export declare function OverlayHeading({ children, title, subHeading, subTitle, }: React_2.ComponentProps<'div'>): any;

export declare function PageCenterLayout({ className, children, title, logo, size, ...props }: React_2.ComponentProps<'div'>): any;

declare interface PaginationAdvancedProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export declare function PaginationControlled({ page, totalPages, onPageChange, }: PaginationAdvancedProps): any;

export declare function PlainLayout({ className, children, ...props }: React_2.ComponentProps<'div'>): any;

export declare function Popover({ ...props }: React_2.ComponentProps<typeof PopoverPrimitive.Root>): any;

export declare function PopoverContent({ className, align, sideOffset, ...props }: React_2.ComponentProps<typeof PopoverPrimitive.Content>): any;

export declare function PopoverTrigger({ ...props }: React_2.ComponentProps<typeof PopoverPrimitive.Trigger>): any;

declare interface Props {
    actions: Action[];
    onChange: (updated: Action[]) => void;
}

declare interface Props_2 {
    actions: Action[];
    onChange: (updated: Action[]) => void;
}

declare interface Props_3 {
    actions: Action[];
    onChange: (updated: Action[]) => void;
}

declare interface Props_4 {
    actions: Action[];
    onChange: (updated: Action[]) => void;
}

declare interface Props_5 {
    condition: Condition;
    onChange: (updated: Condition) => void;
    onDelete: () => void;
    depth?: number;
}

declare interface Props_6 {
    group: RuleGroup_2;
    onChange: (updated: RuleGroup_2) => void;
    onDelete: () => void;
    depth?: number;
    index?: number;
}

export declare function Protected({ children, tId }: any): any;

export declare function ReadOnlyField({ title, children, className }: {
    title: any;
    children: any;
    className: any;
}): any;

export declare function RiskBadge({ score }: {
    score: number;
}): any;

export declare function RiskScoreSlider({ score, sliderOnly, label }: {
    score: number;
    sliderOnly: boolean;
    label: string;
}): any;

export declare const Row: ({ children, justify, align, gap, className, direction, nowrap, }: RowProps & React_2.ComponentProps<"div">) => any;

declare interface RowProps {
    children?: React_2.ReactNode;
    justify?: string;
    align?: string;
    gap?: string;
    className?: string;
    direction?: string;
    nowrap?: boolean;
}

export declare const RuleCondition: default_2.FC<Props_5>;

export declare const RuleEngineWizard: default_2.FC;

export declare const RuleGroup: default_2.FC<Props_6>;

declare type RuleGroup_2 = {
    type: 'AND' | 'OR' | 'NOT';
    conditions: (Condition | RuleGroup_2)[];
};

export declare const RulesAdded: default_2.FC<Props_3>;

export declare function SectionCard({ title, children, subtitle, gap, className, padding }: TableCardProps_2): any;

export declare function Separator({ className, orientation, decorative, ...props }: React_2.ComponentProps<typeof SeparatorPrimitive.Root>): any;

export declare function SideBar({ callback, menuData, switcherData, username, groupName, ...props }: {
    switcherData: {
        name: string;
        logo: React_2.ElementType;
        plan: string;
        icon: IconName;
    }[];
} & React_2.ComponentProps<typeof Sidebar>): any;

declare function Sidebar({ side, variant, collapsible, className, children, ...props }: React_2.ComponentProps<'div'> & {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
}): any;

export declare function SideBarLayout({ menuData, callback, children, padding, modules, username, groupName, }: {
    menuData: {};
    callback: (e: any) => void;
    children?: React_2.ReactNode;
    padding?: boolean;
    modules?: [];
    username?: string;
    groupName?: string;
}): any;

export declare function SimpleCard({ children, title, desc, align, justify, padding, subtitle, className, customHeaderComponents }: SimpleCardProps): any;

declare interface SimpleCardProps {
    children?: React_2.ReactNode;
    title?: string;
    desc?: string;
    subtitle?: string;
    align?: string;
    padding?: boolean;
    className?: string;
    justify?: string;
    customHeaderComponents?: React_2.ReactNode;
}

export declare function SimpleLayout({ children }: React_2.ReactNode): any;

export declare function SimpleModal({ isOpen, title, handleClose, children, close, className, size, }: any): any;

export declare function SimpleSelect({ id, label, name, placeholder, value, onChange, tooltip, error, type, url, data, className, ...props }: CustomSelectProps_2): any;

export declare function SimpleSideBar({ data, menuCallBack, ...props }: any): any;

export declare function SimpleSideBarLayout({ menuData, children, menuCallBack }: any): any;

export declare function SpeedoMeter({ isAnimationActive, }: {
    isAnimationActive?: boolean;
}): any;

export declare function SplitPageLayout({ left, right, logo, orientation, }: any): any;

export declare function StatusBlock({ message, icon, type }: any): any;

export declare function Subheading({ children }: any): any;

export declare function SubmitButton({ label, loading, onClick, className, ...props }: ButtonProps): any;

export declare function Table({ className, ...props }: React_2.ComponentProps<'table'>): any;

export declare function TableBody({ className, ...props }: React_2.ComponentProps<'tbody'>): any;

export declare function TableCaption({ className, ...props }: React_2.ComponentProps<'caption'>): any;

export declare function TableCard({ title, subtitle, count, className, customHeaderComponents, table, totalElements, pageSize, currentElement, showPaging, pagingCallback, filterCallback, refreshCallBack, children, }: TableCardProps): any;

declare interface TableCardProps {
    title?: string;
    subtitle?: string;
    count?: number;
    className?: string;
    customHeaderComponents?: React_2.ReactNode;
    table?: boolean;
    totalElements?: number;
    pageSize?: number;
    currentElement?: number;
    pagingCallback?: (e: any) => void;
    showPaging?: boolean;
    filterCallback?: () => void;
    refreshCallBack?: () => void;
    children?: React_2.ReactNode;
}

declare interface TableCardProps_2 {
    title?: string;
    subtitle?: string;
    count?: number;
    className?: string;
    customHeaderComponents?: React_2.ReactNode;
    table?: boolean;
    gap?: number;
    totalElements?: number;
    pageSize?: number;
    currentElement?: number;
    pagingCallback?: (e: any) => void;
    showPaging?: boolean;
    filterCallback?: () => void;
    refreshCallBack?: () => void;
    children?: React_2.ReactNode;
    padding?: boolean;
}

export declare function TableCell({ className, ...props }: React_2.ComponentProps<'td'>): any;

export declare function TableFooter({ className, ...props }: React_2.ComponentProps<'tfoot'>): any;

export declare function TableHead({ className, ...props }: React_2.ComponentProps<'th'>): any;

export declare function TableHeader({ className, ...props }: React_2.ComponentProps<'thead'>): any;

export declare function TableLayout({ className, children, ...props }: React_2.ComponentProps<'div'>): any;

export declare function TableRow({ className, ...props }: React_2.ComponentProps<'tr'>): any;

export declare const Timeline: ({ data }: {
    data?: any[];
}) => any;

export declare function Tips({ id, label, labelType, title }: TipsProps): any;

declare interface TipsProps {
    id?: string;
    label?: string;
    labelType?: string;
    title?: string;
}

/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
export declare function toast(toastData: Omit<ToastProps, 'id'>): string | number;

export { Toaster }

declare interface ToastProps {
    id: string | number;
    title?: string;
    description?: string;
    variant?: ToastVariant;
    icon?: default_2.ReactNode;
    button?: {
        label: string;
        onClick: () => void;
    };
}

declare type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export declare function ToolTip({ location, message, children, }: OverlayTriggerProps & React_2.ComponentProps<'div'>): any;

export declare const Transaction: default_2.FC<Props>;

export declare const TransactionRuleDetails: default_2.FC<Props_2>;

export declare function Tree({ key, item, level, labelKey, childrenKey, }: {
    level?: number;
    key?: any;
    item: {} | any;
    labelKey?: string;
    childrenKey?: string;
}): any;

/**
 * tabData : [ {
 name: 'Explore',
 value: 'explore',
 content: (
 <>
 Discover <span className='text-foreground font-semibold'>fresh ideas</span>, trending topics, and hidden gems
 curated just for you. Start exploring and let your curiosity lead the way!
 </>
 )
 },]
 */
export declare function UnderlinedTabs({ tabData, defaultValue }: {
    tabData?: any[];
    defaultValue: any;
}): any;

export { }

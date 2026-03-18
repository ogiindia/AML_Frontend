import * as React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../components/ui/pagination";


interface PaginationAdvancedProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function PaginationControlled({
    page,
    totalPages,
    onPageChange,
}: PaginationAdvancedProps) {
    const goToPage = (p: number) => {
        if (p >= 1 && p <= totalPages && p !== page) onPageChange(p);
    };

    // Window logic: show 5 pages around active
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);

    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, page + half);

    // Adjust window so we always show 5 pages when possible
    if (end - start + 1 < windowSize) {
        if (start === 1) {
            end = Math.min(totalPages, start + windowSize - 1);
        } else if (end === totalPages) {
            start = Math.max(1, end - windowSize + 1);
        }
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);

    const showLeftEllipsis = start > 2;
    const showRightEllipsis = end < totalPages - 1;

    return (
        <div className="max-w-[24rem] mx-auto"> {/* col-6 width */}
            <Pagination>
                <PaginationContent>

                    {/* FIRST PAGE BUTTON
                    {page > 1 && (
                        <PaginationItem>
                            <PaginationLink
                                className="cursor-pointer"
                                onClick={() => goToPage(1)}
                            >
                                First
                            </PaginationLink>
                        </PaginationItem>
                    )} */}

                    {/* PREVIOUS */}
                    <PaginationItem>
                        <PaginationPrevious
                            className="cursor-pointer"
                            onClick={() => goToPage(page - 1)}
                        />
                    </PaginationItem>

                    {/* LEFT ELLIPSIS */}
                    {showLeftEllipsis && (
                        <>
                            {/* Page 1 */}
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => goToPage(1)}
                                    className="cursor-pointer"
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>

                            {/* Ellipsis */}
                            <PaginationItem>
                                <span className="px-2 text-muted-foreground">…</span>
                            </PaginationItem>
                        </>
                    )}

                    {/* WINDOW PAGES */}
                    {pages.map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                isActive={page === p}
                                onClick={() => goToPage(p)}
                                className="cursor-pointer"
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {/* RIGHT ELLIPSIS */}
                    {showRightEllipsis && (
                        <>
                            <PaginationItem>
                                <span className="px-2 text-muted-foreground">…</span>
                            </PaginationItem>

                            {/* Last page */}
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => goToPage(totalPages)}
                                    className="cursor-pointer"
                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    )}

                    {/* NEXT */}
                    <PaginationItem>
                        <PaginationNext
                            className="cursor-pointer"
                            onClick={() => goToPage(page + 1)}
                        />
                    </PaginationItem>

                    {/* LAST PAGE BUTTON */}
                    {/* {page < totalPages && (
                        <PaginationItem>
                            <PaginationLink
                                className="cursor-pointer"
                                onClick={() => goToPage(totalPages)}
                            >
                                Last
                            </PaginationLink>
                        </PaginationItem>
                    )} */}

                </PaginationContent>
            </Pagination>
        </div>
    );
}

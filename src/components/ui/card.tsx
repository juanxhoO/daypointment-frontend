import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface CardBoardProps {
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
    contentClassName?: string;
}

export const Card: React.FC<CardBoardProps> = ({
    title,
    subtitle,
    actions,
    children,
    footer,
    className,
    contentClassName,
}) => {
    return (
        <div
            className={clsx(
                'rounded-xl border border-gray-200 bg-white shadow-sm',
                className,
            )}
        >
            {(title || subtitle || actions) && (
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5">
                    <div>
                        {title && (
                            <h3 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h3>
                        )}

                        {subtitle && (
                            <p className="mt-1 text-sm text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {actions && (
                        <div className="flex items-center gap-2">
                            {actions}
                        </div>
                    )}
                </div>
            )}

            <div className={clsx('p-5', contentClassName)}>
                {children}
            </div>

            {footer && (
                <div className="border-t border-gray-100 p-5">
                    {footer}
                </div>
            )}
        </div>
    );
};
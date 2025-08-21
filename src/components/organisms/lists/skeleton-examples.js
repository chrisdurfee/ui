import { Button, Div, Td, Tr } from '@base-framework/atoms';
import { Skeleton } from '../../atoms/skeleton.js';
import { DataTable } from './data-table.js';

/**
 * Example: Basic DataTable with default skeleton
 */
export const BasicSkeletonExample = () => {
    return new DataTable({
        skeleton: true, // Shows 5 skeleton rows by default
        headers: [
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Status' }
        ],
        rowItem: (user) => Tr([
            Td({ class: 'px-6 py-4' }, user.name),
            Td({ class: 'px-6 py-4' }, user.email),
            Td({ class: 'px-6 py-4' }, user.status)
        ])
    });
};

/**
 * Example: Custom skeleton count
 */
export const CustomCountExample = () => {
    return new DataTable({
        skeleton: { number: 10 }, // Shows 10 skeleton rows
        headers: [
            { key: 'product', label: 'Product' },
            { key: 'price', label: 'Price' },
            { key: 'category', label: 'Category' },
            { key: 'stock', label: 'Stock' }
        ],
        rowItem: (product) => Tr([
            Td({ class: 'px-6 py-4' }, product.name),
            Td({ class: 'px-6 py-4' }, `$${product.price}`),
            Td({ class: 'px-6 py-4' }, product.category),
            Td({ class: 'px-6 py-4' }, product.stock)
        ])
    });
};

/**
 * Example: Custom skeleton row with avatar and varying content
 */
export const CustomSkeletonRowExample = () => {
    const customSkeletonRow = (index, columnCount) => {
        return Tr({
            class: 'border-b hover:bg-gray-50',
            key: `custom-skeleton-${index}`
        }, [
            // Avatar column
            Td({ class: 'px-6 py-4' }, [
                Div({ class: 'flex items-center space-x-3' }, [
                    Skeleton({
                        shape: 'circle',
                        width: 'w-10',
                        height: 'h-10'
                    }),
                    Div([
                        Skeleton({ width: 'w-24', height: 'h-4' }),
                        Div({ class: 'mt-1' }, [
                            Skeleton({ width: 'w-16', height: 'h-3' })
                        ])
                    ])
                ])
            ]),
            // Email column
            Td({ class: 'px-6 py-4' }, [
                Skeleton({ width: 'w-32', height: 'h-4' })
            ]),
            // Role column
            Td({ class: 'px-6 py-4' }, [
                Skeleton({
                    width: 'w-20',
                    height: 'h-6',
                    class: 'rounded-full'
                })
            ]),
            // Status column
            Td({ class: 'px-6 py-4' }, [
                Skeleton({
                    width: 'w-16',
                    height: 'h-6',
                    class: 'rounded-full'
                })
            ]),
            // Actions column
            Td({ class: 'px-6 py-4' }, [
                Div({ class: 'flex space-x-2' }, [
                    Skeleton({ width: 'w-8', height: 'h-8', shape: 'circle' }),
                    Skeleton({ width: 'w-8', height: 'h-8', shape: 'circle' }),
                    Skeleton({ width: 'w-8', height: 'h-8', shape: 'circle' })
                ])
            ])
        ]);
    };

    return new DataTable({
        skeleton: {
            number: 8,
            row: customSkeletonRow
        },
        headers: [
            { key: 'user', label: 'User' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' }
        ],
        rowItem: (user) => Tr([
            Td({ class: 'px-6 py-4' }, [
                Div({ class: 'flex items-center space-x-3' }, [
                    Div({
                        class: 'w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center'
                    }, user.name.charAt(0)),
                    Div([
                        Div({ class: 'font-medium' }, user.name),
                        Div({ class: 'text-sm text-gray-500' }, user.username)
                    ])
                ])
            ]),
            Td({ class: 'px-6 py-4' }, user.email),
            Td({ class: 'px-6 py-4' }, [
                Div({ class: 'px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm' }, user.role)
            ]),
            Td({ class: 'px-6 py-4' }, [
                Div({
                    class: `px-2 py-1 rounded-full text-sm ${
                        user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`
                }, user.active ? 'Active' : 'Inactive')
            ]),
            Td({ class: 'px-6 py-4' }, [
                Div({ class: 'flex space-x-2' }, [
                    Button({ class: 'p-1 text-gray-400 hover:text-gray-600' }, '✏️'),
                    Button({ class: 'p-1 text-gray-400 hover:text-gray-600' }, '👁️'),
                    Button({ class: 'p-1 text-gray-400 hover:text-red-600' }, '🗑️')
                ])
            ])
        ])
    });
};

/**
 * Demo function showing how to load data and remove skeleton
 */
export const demonstrateSkeletonUsage = () => {
    // Create table with skeleton
    const table = BasicSkeletonExample();

    // Simulate loading data after 2 seconds
    setTimeout(() => {
        const mockUsers = [
            { name: 'John Doe', email: 'john@example.com', status: 'Active' },
            { name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
            { name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' }
        ];

        // This will automatically remove the skeleton
        table.setRows(mockUsers);
    }, 2000);

    return table;
};

export default {
    BasicSkeletonExample,
    CustomCountExample,
    CustomSkeletonRowExample,
    demonstrateSkeletonUsage
};

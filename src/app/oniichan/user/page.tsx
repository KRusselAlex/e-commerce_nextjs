"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { columns, Payment } from "@/app/oniichan/shop/product/columns"; // Import columns from the file above
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Dashboard from "@/components/admin/dashboard";

export default function ManageUser() {
    const data: Payment[] = [
      {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@example.com",
      },
      {
        id: "3u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@example.com",
      },
      {
        id: "derv1ws0",
        amount: 837,
        status: "processing",
        email: "Monserrat44@example.com",
      },
      {
        id: "5kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@example.com",
      },
      {
        id: "bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@example.com",
      },
      {
        id: "x9z3rTqL",
        amount: 105,
        status: "success",
        email: "laura.smith@example.com",
      },
      {
        id: "aBcD1234",
        amount: 500,
        status: "processing",
        email: "john.doe@domain.co",
      },
      {
        id: "pQ90vXlK",
        amount: 200,
        status: "success",
        email: "emily_jones@example.org",
      },
      {
        id: "rR4nKtZw",
        amount: 950,
        status: "failed",
        email: "mark.williams@testmail.net",
      },
      {
        id: "sS5mNp9R",
        amount: 400,
        status: "pending",
        email: "anna.taylor@mailbox.io",
      },
      {
        id: "tT6kXq3V",
        amount: 150,
        status: "success",
        email: "robert.carter@example.net",
      },
      {
        id: "uU7pWz2Q",
        amount: 600,
        status: "processing",
        email: "sarah.connor@myemail.com",
      },
      {
        id: "vV8oYx1M",
        amount: 300,
        status: "failed",
        email: "thomas.harris@demo.org",
      },
      {
        id: "wW9lZr4J",
        amount: 250,
        status: "pending",
        email: "natalie.white@example.co",
      },
      {
        id: "xX0qKt7H",
        amount: 700,
        status: "success",
        email: "daniel.miller@mailservice.app",
      },
      {
        id: "yY1rPm5F",
        amount: 800,
        status: "processing",
        email: "olivia.brown@fastmail.org",
      },
      {
        id: "zZ2tQw9E",
        amount: 120,
        status: "failed",
        email: "william.jackson@example.email",
      },
      {
        id: "aA3eTv8D",
        amount: 450,
        status: "success",
        email: "ava.thompson@securemail.net",
      },
      {
        id: "bB4rKp2Z",
        amount: 650,
        status: "pending",
        email: "liam.rodriguez@examplemail.org",
      },
      {
        id: "cC5tMq6X",
        amount: 900,
        status: "processing",
        email: "noah.patel@quickmail.app",
      },
      {
        id: "dD6wFr1Y",
        amount: 350,
        status: "success",
        email: "mia.khan@example.co.uk",
      },
      {
        id: "eE7qXz5N",
        amount: 220,
        status: "failed",
        email: "elijah.nguyen@fakemail.org",
      },
      {
        id: "fF8pWv3G",
        amount: 550,
        status: "pending",
        email: "sophia.garcia@tempmail.net",
      },
      {
        id: "gG9oYq7R",
        amount: 750,
        status: "processing",
        email: "james.wilson@examplemail.dev",
      },
      {
        id: "hH0rTm2L",
        amount: 180,
        status: "success",
        email: "isabella.lopez@coolmail.site",
      },
      {
        id: "iI1tQx6V",
        amount: 850,
        status: "failed",
        email: "ethan.zhang@example.org",
      },
      {
        id: "jJ2kNm9Z",
        amount: 600,
        status: "success",
        email: "charlotte.li@inboxpro.app",
      },
      {
        id: "kK3pXw4F",
        amount: 420,
        status: "processing",
        email: "henry.torres@demo.mail",
      },
      {
        id: "lL4qZv8T",
        amount: 330,
        status: "pending",
        email: "amelia.clark@fake-email.org",
      },
      {
        id: "mM5rWq1H",
        amount: 990,
        status: "failed",
        email: "jack.evans@example-mail.dev",
      },
    ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Dashboard>
      <div className="w-full mx-auto max-w-[110em]">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

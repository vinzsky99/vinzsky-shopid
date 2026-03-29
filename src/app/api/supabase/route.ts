import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Inisialisasi Supabase - pakai env yang TIDAK public
const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase credentials tidak ditemukan di environment')
  }

  return createClient(url, key)
}

// GET - Ambil data
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const table = searchParams.get('table')

    if (!table) {
      return NextResponse.json(
        { error: 'Parameter table diperlukan' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.from(table).select('*')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Insert data
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()
    const { table, payload } = body

    if (!table || !payload) {
      return NextResponse.json(
        { error: 'Parameter table dan payload diperlukan' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.from(table).insert(payload).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update data
export async function PATCH(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()
    const { table, payload, match } = body

    if (!table || !payload || !match) {
      return NextResponse.json(
        { error: 'Parameter table, payload, dan match diperlukan' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .match(match)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Hapus data
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const table = searchParams.get('table')
    const id = searchParams.get('id')

    if (!table || !id) {
      return NextResponse.json(
        { error: 'Parameter table dan id diperlukan' },
        { status: 400 }
      )
    }

    const { error } = await supabase.from(table).delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Data berhasil dihapus' }, { status: 200 })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
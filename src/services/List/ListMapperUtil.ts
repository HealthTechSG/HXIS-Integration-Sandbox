import type {
  FhirList,
  FhirListResource,
  FhirListBundle,
  List,
  ListEntry,
  CreateListRequest,
  UpdateListRequest,
  SearchResourceResult,
  GetListParams,
} from './ListTypes';
import { LIST_CODE_OPTIONS } from './ListTypes';

//* List Mapper Utility -----------------------------------------------------------
const ListMapperUtil = {
  //* --------------------------------------------------------------------------
  //* FHIR List Mapping
  //* --------------------------------------------------------------------------
  mapFromFhirList: (fhirList: FhirList): List => {
    // Extract subject reference (Patient ID)
    const subjectReference = fhirList.subject?.reference || '';
    const subject = subjectReference.startsWith('Patient/')
      ? subjectReference.substring(8)
      : subjectReference;

    // Extract source reference (Practitioner ID)
    const sourceReference = fhirList.source?.reference || '';
    const source = sourceReference.startsWith('Practitioner/')
      ? sourceReference.substring(13)
      : sourceReference;

    // Extract code information
    const coding = fhirList.code?.coding?.[0];
    const code = coding?.code || '';
    const codeDisplay = coding?.display || '';
    const codeSystem = coding?.system || 'https://r4.fhir.space/codesystem-list-example-codes.html';

    // Extract entries
    const entries: ListEntry[] = fhirList.entry?.map(entry => {
      const itemReference = entry.item?.reference || '';
      let type = '';
      let reference = itemReference;

      // Extract resource type and ID from reference
      if (itemReference.includes('/')) {
        const parts = itemReference.split('/');
        if (parts.length >= 2) {
          type = parts[0];
          reference = parts[1];
        }
      }

      return {
        reference,
        type,
        display: entry.item?.display,
        deleted: entry.deleted || false,
        date: entry.date || undefined,
      };
    }) || [];

    // Extract notes
    const note = fhirList.note?.[0]?.text || undefined;

    return {
      id: fhirList.id || '',
      status: fhirList.status,
      mode: fhirList.mode,
      title: fhirList.title || '',
      code,
      codeDisplay,
      codeSystem,
      subject,
      date: fhirList.date || new Date().toISOString(),
      source: source || undefined,
      entries,
      note,
    } as List;
  },

  //* --------------------------------------------------------------------------
  mapFromFhirListResource: (fhirResource: FhirListResource): List => {
    return ListMapperUtil.mapFromFhirList(fhirResource);
  },

  //* --------------------------------------------------------------------------
  mapToFhirList: (list: Partial<List | CreateListRequest | UpdateListRequest>): FhirListResource => {
    // Build the FHIR List resource
    const fhirResource: FhirListResource = {
      resourceType: 'List',
      meta: {
        versionId: '1',
        lastUpdated: new Date().toISOString(),
      },
      status: list.status || 'current',
      mode: list.mode || 'working',
      title: list.title || '',
      code: {
        coding: [
          {
            system: list.codeSystem || 'https://r4.fhir.space/codesystem-list-example-codes.html',
            code: list.code || '',
            display: list.codeDisplay || list.code || '',
          },
        ],
      },
      subject: {
        reference: `Patient/${list.subject}`,
      },
      date: (() => {
        if (!list.date) {
          return new Date().toISOString();
        }
        if (typeof list.date === 'string') {
          return list.date;
        }
        return (list.date as any).toISOString();
      })(),
    };

    // Add ID only for updates (when it exists and is not empty)
    if ((list as any).id && (list as any).id.trim() !== '') {
      fhirResource.id = (list as any).id;
    }

    // Add entries if provided
    if (list.entries && list.entries.length > 0) {
      const listMode = list.mode || 'working';
      fhirResource.entry = list.entries.map(entry => {
        const entryItem: any = {
          item: {
            reference: entry.type ? `${entry.type}/${entry.reference}` : entry.reference,
            display: entry.display,
          },
        };

        // Only add deleted flag if mode is "changes" and the entry is actually deleted
        if (listMode === 'changes' && entry.deleted === true) {
          entryItem.deleted = true;
        }

        // Add date if provided
        if (entry.date) {
          entryItem.date = typeof entry.date === 'string'
            ? entry.date
            : (entry.date as any).toISOString();
        }

        return entryItem;
      });
    }

    // Add note if provided
    if (list.note) {
      fhirResource.note = [
        {
          text: list.note,
          time: new Date().toISOString(),
        },
      ];
    }

    return fhirResource;
  },

  //* --------------------------------------------------------------------------
  //* Bundle Response Mapping
  //* --------------------------------------------------------------------------
  mapFromFhirListBundle: (bundle: FhirListBundle): SearchResourceResult<List> => {
    const lists = bundle.entry?.map(entry =>
      ListMapperUtil.mapFromFhirListResource(entry.resource)
    ) || [];

    return {
      entry: lists,
      total: bundle.total || lists.length,
      hasNextPage: bundle.link?.some(link => link.relation === 'next') || false,
    };
  },

  //* --------------------------------------------------------------------------
  //* Filter Mapping
  //* --------------------------------------------------------------------------
  mapToFhirListFilters: ({
    code,
    date,
    page,
    pageSize,
    patient,
    status,
    title,
    ...filters
  }: Partial<GetListParams>) => ({
    ...(patient && { patient }),
    ...(code && { code }),
    ...(status && { status }),
    ...(title && { title }),
    ...(date && { date }),
    // Note: List resource doesn't support _offset pagination, only _count
    ...(pageSize && { _count: pageSize }),
    ...filters,
  }),

  //* --------------------------------------------------------------------------
  //* Utility Functions
  //* --------------------------------------------------------------------------
  getCodeDisplayFromValue: (codeValue: string): string => {
    const codeOption = LIST_CODE_OPTIONS.find(option => option.value === codeValue);
    return codeOption?.label || codeValue;
  },

  getCodeSystemFromValue: (codeValue: string): string => {
    const codeOption = LIST_CODE_OPTIONS.find(option => option.value === codeValue);
    return codeOption?.system || 'https://r4.fhir.space/codesystem-list-example-codes.html';
  },

  validateListEntry: (entry: ListEntry): boolean => {
    return !!(entry.reference && entry.reference.trim().length > 0);
  },

  validateList: (list: Partial<CreateListRequest>): string[] => {
    const errors: string[] = [];

    if (!list.title || list.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!list.code || list.code.trim().length === 0) {
      errors.push('Code is required');
    }

    if (!list.subject || list.subject.trim().length === 0) {
      errors.push('Subject (Patient ID) is required');
    }

    if (!list.status) {
      errors.push('Status is required');
    }

    if (!list.mode) {
      errors.push('Mode is required');
    }

    if (list.entries) {
      list.entries.forEach((entry, index) => {
        if (!ListMapperUtil.validateListEntry(entry)) {
          errors.push(`Entry ${index + 1}: Reference is required`);
        }
      });
    }

    return errors;
  },

  //* --------------------------------------------------------------------------
  //* Entry Management Utilities
  //* --------------------------------------------------------------------------
  addEntryToList: (list: List, entry: ListEntry): List => {
    const existingEntryIndex = list.entries.findIndex(
      e => e.reference === entry.reference && e.type === entry.type
    );

    if (existingEntryIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...list.entries];
      updatedEntries[existingEntryIndex] = { ...entry };
      return { ...list, entries: updatedEntries };
    } else {
      // Add new entry
      return {
        ...list,
        entries: [...list.entries, { ...entry }],
      };
    }
  },

  removeEntryFromList: (list: List, entryReference: string, entryType?: string): List => {
    return {
      ...list,
      entries: list.entries.filter(
        entry => !(entry.reference === entryReference &&
                  (!entryType || entry.type === entryType))
      ),
    };
  },

  markEntryAsDeleted: (list: List, entryReference: string, entryType?: string): List => {
    return {
      ...list,
      entries: list.entries.map(entry =>
        entry.reference === entryReference && (!entryType || entry.type === entryType)
          ? { ...entry, deleted: true }
          : entry
      ),
    };
  },

  getActiveEntries: (list: List): ListEntry[] => {
    return list.entries.filter(entry => !entry.deleted);
  },

  getDeletedEntries: (list: List): ListEntry[] => {
    return list.entries.filter(entry => entry.deleted === true);
  },

  //* --------------------------------------------------------------------------
  //* Template Utilities
  //* --------------------------------------------------------------------------
  createListFromTemplate: (
    templateCode: string,
    subject: string,
    title?: string,
    entries: ListEntry[] = []
  ): CreateListRequest => {
    const codeOption = LIST_CODE_OPTIONS.find(option => option.value === templateCode);

    if (!codeOption) {
      throw new Error(`Invalid template code: ${templateCode}`);
    }

    return {
      status: 'current',
      mode: 'working',
      title: title || `Current ${codeOption.label}`,
      code: codeOption.value,
      codeDisplay: codeOption.label,
      codeSystem: codeOption.system,
      subject,
      date: new Date().toISOString(),
      entries,
    };
  },
};

export { ListMapperUtil };
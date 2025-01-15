/* eslint-disable vue/no-v-model-argument */
<template>
    <div class="card">
        <DataTable
            :value="fines"
            :paginator="true"
            :rows="10"
            :loading="loading"
            dataKey="id"
            responsiveLayout="scroll"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50]"
            class="p-datatable-sm"
        >
            <template #header>
                <div class="text-center mb-7" >
                    <h1 class="text-3xl font-bold text-center">{{ $t('fine.title') }}</h1>
                </div>
            </template>
            
            <Column :header="$t('fine.fields.no')" alignHeader="center" style="width: 5rem">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>

            <Column field="user.name" :header="$t('fine.fields.user')" :sortable="true">
                <template #body="slotProps">
                    <div class="flex align-items-center gap-2">
                        <span>{{ slotProps.data.user?.name || 'N/A' }}</span>
                    </div>
                </template>
            </Column>

            <Column field="borrowing.book.title" :header="$t('fine.fields.book')" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.borrowing?.book?.title || 'N/A' }}
                </template>
            </Column>

            <Column field="amount" :header="$t('fine.fields.amount')" :sortable="true">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.amount) }}
                </template>
            </Column>

            <Column field="fine_date" :header="$t('fine.fields.fineDate')" :sortable="true">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.fine_date) }}
                </template>
            </Column>

            <Column field="status" :header="$t('fine.fields.status')" :sortable="true">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                </template>
            </Column>

            <Column field="payment_method" :header="$t('fine.fields.paymentMethod')" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.payment_method || '-' }}
                </template>
            </Column>

            <Column :header="$t('fine.fields.actions')" style="min-width:10rem">
                <template #body="slotProps">
                    <div class="flex gap-2 justify-content-center">
                        <Button 
                            type="button"
                            icon="pi pi-eye"
                            class="p-button-rounded p-button-info"
                            v-tooltip.top="$t('fine.actions.viewDetails')"
                            @click="openDetails(slotProps.data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- eslint-disable-next-line vue/no-v-model-argument -->
        <Dialog v-model:visible="showDetailsDialog"
            :header="$t('fine.dialog.details.title')"
            :modal="true"
            :style="{ width: '500px' }"
            class="p-fluid"
            :closable="true"
            :closeOnEscape="true"
        >
            <div v-if="selectedFine" class="space-y-4">
                <div class="p-4 surface-card border-round">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-500 mb-2">{{ $t('fine.dialog.details.user') }}</p>
                            <p class="text-900 font-medium">{{ selectedFine.user?.name }}</p>
                        </div>
                        <div>
                            <p class="text-500 mb-2">{{ $t('fine.dialog.details.book') }}</p>
                            <p class="text-900 font-medium">{{ selectedFine.borrowing?.book?.title }}</p>
                        </div>
                        <div>
                            <p class="text-500 mb-2">{{ $t('fine.dialog.details.amount') }}</p>
                            <p class="text-900 font-medium">{{ formatCurrency(selectedFine.amount) }}</p>
                        </div>
                        <div>
                            <p class="text-500 mb-2">{{ $t('fine.dialog.details.fineDate') }}</p>
                            <p class="text-900 font-medium">{{ formatDate(selectedFine.fine_date) }}</p>
                        </div>
                        <div>
                            <p class="text-500 mb-2">{{ $t('fine.dialog.details.status') }}</p>
                            <Tag :value="selectedFine.status" :severity="getStatusSeverity(selectedFine.status)" />
                        </div>
                        <div>
                            <p class="text-500 mb-2">{{ $t('fine.dialog.details.paymentMethod') }}</p>
                            <p class="text-900 font-medium">{{ selectedFine.payment_method || '-' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons in Dialog -->
                <div v-if="selectedFine.status === 'pending'" class="flex justify-end gap-2 pt-4">
                    <Button
                        icon="pi pi-money-bill"
                        label="Pay Fine"
                        severity="success"
                        @click="confirmPayment(selectedFine)"
                    />
                    <Button
                        icon="pi pi-times"
                        label="Cancel Fine"
                        severity="danger"
                        @click="confirmCancel(selectedFine)"
                    />
                </div>
            </div>
        </Dialog>

        <Toast />
        <ConfirmDialog />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import FineService from './services/Fine';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmDialog from 'primevue/confirmdialog';

const toast = useToast();
const loading = ref(false);
const fines = ref([]);
const confirm = useConfirm();
const showDetailsDialog = ref(false);
const selectedFine = ref(null);

const openDetails = (fine) => {
    selectedFine.value = { ...fine };
    showDetailsDialog.value = true;
};

const loadFines = async () => {
    try {
        loading.value = true;
        const response = await FineService.getFines();
        fines.value = response.data.data;
        console.log('Fines data:', fines.value); // For debugging
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load fines', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const confirmPayment = (fine) => {
    showDetailsDialog.value = false;
    confirm.require({
        message: 'Are you sure you want to mark this fine as paid?',
        header: 'Confirm Payment',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-success',
        accept: async () => {
            try {
                await FineService.markAsPaid(fine.id);
                showDetailsDialog.value = false;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Fine has been marked as paid', life: 3000 });
                await loadFines();
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'Failed to mark fine as paid', life: 3000 });
            }
        },
        reject: () => {}
    });
    console.log("is show");
};

const confirmCancel = (fine) => {
    confirm.require({
        message: 'Are you sure you want to cancel this fine?',
        header: 'Confirm Cancellation',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await FineService.cancel(fine.id);
                showDetailsDialog.value = false;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Fine has been cancelled', life: 3000 });
                await loadFines();
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'Failed to cancel fine', life: 3000 });
            }
        },
        reject: () => {}
    });
};

const getStatusSeverity = (status) => {
    switch (status) {
        case 'paid':
            return 'success';
        case 'pending':
            return 'warning';
        case 'cancelled':
            return 'danger';
        default:
            return 'info';
    }
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (value) => {
    return new Date(value).toLocaleDateString('vi-VN');
};

onMounted(() => {
    loadFines();
});
</script>

<style scoped>
.card {
    background: var(--surface-card);
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-radius: var(--border-radius);
    box-shadow: var(--card-shadow);
}
</style>
